interface CreatedUser {
  login: string,
  name: string,
  password: string,
}

interface AuthedUser {
  login: string,
  password: string,
}

export type { CreatedUser, AuthedUser };
