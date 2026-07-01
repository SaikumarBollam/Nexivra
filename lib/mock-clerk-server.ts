import { NextRequest, NextResponse } from "next/server";

const mockUser = {
  id: "mock_user_123",
  firstName: "Jane",
  lastName: "Doe",
  imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  username: "janedoe",
  emailAddresses: [{ emailAddress: "jane.doe@example.com" }]
};

export const currentUser = async () => {
  return mockUser;
};

export const auth = async () => {
  return {
    userId: mockUser.id,
    sessionId: "mock_session_123",
    orgId: null
  };
};

export const clerkMiddleware = () => {
  return (req: any, event: any) => {
    return NextResponse.next();
  };
};
