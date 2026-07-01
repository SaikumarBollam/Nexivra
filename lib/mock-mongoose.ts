// Neon Postgres-backed Mongoose Mock for AI Studio

let sql: any = null;
let dbInitializationPromise: Promise<void> | null = null;

async function getSql() {
  if (typeof window !== 'undefined') return null;
  if (!sql) {
    const { neon } = require('@neondatabase/serverless');
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn("DATABASE_URL is not set!");
      return null;
    }
    sql = neon(dbUrl);
  }
  if (!dbInitializationPromise) {
    dbInitializationPromise = (async () => {
      try {
        // Create tables if they do not exist
        await sql`
          CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(255) PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            profile_photo TEXT,
            bio TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS posts (
            id VARCHAR(255) PRIMARY KEY,
            description TEXT NOT NULL,
            user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
            image_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS likes (
            post_id VARCHAR(255) REFERENCES posts(id) ON DELETE CASCADE,
            user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
            PRIMARY KEY (post_id, user_id)
          );
        `;
        await sql`
          CREATE TABLE IF NOT EXISTS comments (
            id VARCHAR(255) PRIMARY KEY,
            post_id VARCHAR(255) REFERENCES posts(id) ON DELETE CASCADE,
            user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
            text_message TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        console.log("Neon Postgres tables initialized successfully.");
      } catch (err) {
        console.error("Failed to initialize Neon Postgres tables:", err);
        dbInitializationPromise = null;
        throw err;
      }
    })();
  }
  await dbInitializationPromise;
  return sql;
}

function wrapDoc(modelName: string, doc: any) {
  return {
    ...doc,
    save: async function() {
      const sql = await getSql();
      if (!sql) return this;

      if (modelName === 'Post') {
        if (this.comments && this.comments.length > 0) {
          const commentIds = this.comments.map((c: any) => typeof c === 'string' ? c : c._id);
          for (const cid of commentIds) {
            await sql`
              UPDATE comments
              SET post_id = ${this._id}
              WHERE id = ${cid}
            `;
          }
        }
      }
      return this;
    },
    updateOne: async function(update: any) {
      const sql = await getSql();
      if (!sql) return { modifiedCount: 0 };

      if (modelName === 'Post') {
        if (update.$addToSet && update.$addToSet.likes) {
          const userId = update.$addToSet.likes;
          await sql`
            INSERT INTO likes (post_id, user_id)
            VALUES (${this._id}, ${userId})
            ON CONFLICT DO NOTHING
          `;
          if (!this.likes.includes(userId)) {
            this.likes.push(userId);
          }
        }
        if (update.$pull && update.$pull.likes) {
          const userId = update.$pull.likes;
          await sql`
            DELETE FROM likes
            WHERE post_id = ${this._id} AND user_id = ${userId}
          `;
          this.likes = this.likes.filter((id: string) => id !== userId);
        }
      }
      return { modifiedCount: 1 };
    },
    populate: function(options: any) {
      return this;
    }
  };
}

class MockQuery {
  private modelName: string;
  private isFindOne: boolean = false;
  private idToFind: string | null = null;
  private sortOptions: any = null;
  private populateOptions: any = null;

  constructor(modelName: string, isFindOne = false, idToFind: string | null = null) {
    this.modelName = modelName;
    this.isFindOne = isFindOne;
    this.idToFind = idToFind;
  }

  sort(options: any) {
    this.sortOptions = options;
    return this;
  }

  populate(options: any) {
    this.populateOptions = options;
    return this;
  }

  async exec() {
    const sql = await getSql();
    if (!sql) return this.isFindOne ? null : [];

    if (this.modelName === 'Post') {
      if (this.isFindOne && this.idToFind) {
        // Query single post
        const postsData = await sql`
          SELECT p.id as _id, p.description, p.image_url as "imageUrl", p.created_at as "createdAt", p.updated_at as "updatedAt",
                 u.id as "userId", u.first_name as "firstName", u.last_name as "lastName", u.profile_photo as "profilePhoto"
          FROM posts p
          JOIN users u ON p.user_id = u.id
          WHERE p.id = ${this.idToFind}
        `;
        if (postsData.length === 0) return null;
        const row = postsData[0];

        // Fetch likes
        const likesData = await sql`
          SELECT user_id FROM likes WHERE post_id = ${this.idToFind}
        `;
        const likes = likesData.map((l: any) => l.user_id);

        // Fetch comments
        const commentsData = await sql`
          SELECT c.id as _id, c.text_message as "textMessage", c.created_at as "createdAt", c.updated_at as "updatedAt",
                 u.id as "userId", u.first_name as "firstName", u.last_name as "lastName", u.profile_photo as "profilePhoto"
          FROM comments c
          JOIN users u ON c.user_id = u.id
          WHERE c.post_id = ${this.idToFind}
          ORDER BY c.created_at DESC
        `;
        const comments = commentsData.map((c: any) => ({
          _id: c._id,
          textMessage: c.textMessage,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          user: {
            userId: c.userId,
            firstName: c.firstName,
            lastName: c.lastName,
            profilePhoto: c.profilePhoto
          }
        }));

        const doc = {
          _id: row._id,
          description: row.description,
          imageUrl: row.imageUrl,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          user: {
            userId: row.userId,
            firstName: row.firstName,
            lastName: row.lastName,
            profilePhoto: row.profilePhoto
          },
          likes,
          comments
        };

        return wrapDoc('Post', doc);
      }

      // Query all posts
      const postsData = await sql`
        SELECT p.id as _id, p.description, p.image_url as "imageUrl", p.created_at as "createdAt", p.updated_at as "updatedAt",
               u.id as "userId", u.first_name as "firstName", u.last_name as "lastName", u.profile_photo as "profilePhoto"
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
      `;

      const likesData = await sql`
        SELECT post_id, user_id FROM likes
      `;
      const likesMap: Record<string, string[]> = {};
      for (const row of likesData) {
        if (!likesMap[row.post_id]) likesMap[row.post_id] = [];
        likesMap[row.post_id].push(row.user_id);
      }

      const commentsData = await sql`
        SELECT c.id as _id, c.post_id, c.text_message as "textMessage", c.created_at as "createdAt", c.updated_at as "updatedAt",
               u.id as "userId", u.first_name as "firstName", u.last_name as "lastName", u.profile_photo as "profilePhoto"
        FROM comments c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
      `;
      const commentsMap: Record<string, any[]> = {};
      for (const row of commentsData) {
        if (!commentsMap[row.post_id]) commentsMap[row.post_id] = [];
        commentsMap[row.post_id].push({
          _id: row._id,
          textMessage: row.textMessage,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          user: {
            userId: row.userId,
            firstName: row.firstName,
            lastName: row.lastName,
            profilePhoto: row.profilePhoto
          }
        });
      }

      const posts = postsData.map((row: any) => {
        const postLikes = likesMap[row._id] || [];
        const postComments = commentsMap[row._id] || [];
        return {
          _id: row._id,
          description: row.description,
          imageUrl: row.imageUrl,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          user: {
            userId: row.userId,
            firstName: row.firstName,
            lastName: row.lastName,
            profilePhoto: row.profilePhoto
          },
          likes: postLikes,
          comments: postComments
        };
      });

      return posts;
    }

    return this.isFindOne ? null : [];
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

class MockModel {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  async create(data: any) {
    const sql = await getSql();
    if (!sql) return null;

    const id = Math.random().toString(36).substring(2, 11);
    const now = new Date();

    if (this.name === 'Post') {
      const user = data.user;
      if (user) {
        await sql`
          INSERT INTO users (id, first_name, last_name, profile_photo)
          VALUES (${user.userId}, ${user.firstName}, ${user.lastName}, ${user.profilePhoto})
          ON CONFLICT (id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            profile_photo = EXCLUDED.profile_photo
        `;
      }
      await sql`
        INSERT INTO posts (id, description, user_id, image_url, created_at, updated_at)
        VALUES (${id}, ${data.description}, ${user?.userId || null}, ${data.imageUrl || null}, ${now}, ${now})
      `;
      const doc = {
        _id: id,
        description: data.description,
        user,
        imageUrl: data.imageUrl || '',
        likes: [],
        comments: [],
        createdAt: now,
        updatedAt: now
      };
      return wrapDoc('Post', doc);
    } else if (this.name === 'Comment') {
      const user = data.user;
      if (user) {
        await sql`
          INSERT INTO users (id, first_name, last_name, profile_photo)
          VALUES (${user.userId}, ${user.firstName}, ${user.lastName}, ${user.profilePhoto})
          ON CONFLICT (id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            profile_photo = EXCLUDED.profile_photo
        `;
      }
      await sql`
        INSERT INTO comments (id, user_id, text_message, created_at, updated_at)
        VALUES (${id}, ${user?.userId || null}, ${data.textMessage}, ${now}, ${now})
      `;
      const doc = {
        _id: id,
        textMessage: data.textMessage,
        user,
        createdAt: now,
        updatedAt: now
      };
      return wrapDoc('Comment', doc);
    }

    return null;
  }

  find() {
    return new MockQuery(this.name);
  }

  findById(query: any) {
    const id = typeof query === 'object' && query._id ? query._id : query;
    return new MockQuery(this.name, true, id.toString());
  }

  async deleteOne(query: any) {
    const sql = await getSql();
    if (!sql) return { deletedCount: 0 };

    const id = query._id || query;
    await sql`
      DELETE FROM posts
      WHERE id = ${id.toString()}
    `;
    return { deletedCount: 1 };
  }
}

const modelsRegistry: Record<string, any> = {};

export class Schema {
  static Types = {
    ObjectId: 'ObjectId'
  };
  constructor() {}
}

export const connect = async () => {
  await getSql();
  return { connection: { db: {} } };
};

export const set = () => {};

export const model = (name: string, schema: any) => {
  if (!modelsRegistry[name]) {
    modelsRegistry[name] = new MockModel(name);
  }
  return modelsRegistry[name];
};

export const models = modelsRegistry;

export type Document = any;
export type Model<T> = any;
export type Connection = any;

const mockMongoose = {
  Schema,
  connect,
  set,
  model,
  models
};

export default mockMongoose;
