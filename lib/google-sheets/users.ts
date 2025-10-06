import { getSheetData, appendSheetData, updateSheetData } from "./client"

export interface User {
  id: string
  email: string
  password: string // hashed
  name: string
  role: "admin" | "player"
  teamId?: string
  college?: string
  createdAt: string
}

export async function getAllUsers(): Promise<User[]> {
  const data = await getSheetData("Users!A2:H")

  if (!data || data.length === 0) {
    return []
  }

  return data.map((row) => ({
    id: row[0] || "",
    email: row[1] || "",
    password: row[2] || "",
    name: row[3] || "",
    role: (row[4] || "player") as "admin" | "player",
    teamId: row[5] || undefined,
    college: row[6] || undefined,
    createdAt: row[7] || new Date().toISOString(),
  }))
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getAllUsers()
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getAllUsers()
  return users.find((user) => user.id === id) || null
}

export async function createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const createdAt = new Date().toISOString()

  const newUser: User = {
    ...user,
    id,
    createdAt,
  }

  await appendSheetData("Users!A:H", [
    [
      newUser.id,
      newUser.email,
      newUser.password,
      newUser.name,
      newUser.role,
      newUser.teamId || "",
      newUser.college || "",
      newUser.createdAt,
    ],
  ])

  return newUser
}

export async function updateUser(id: string, updates: Partial<User>): Promise<void> {
  const users = await getAllUsers()
  const index = users.findIndex((user) => user.id === id)

  if (index === -1) {
    throw new Error("User not found")
  }

  const user = { ...users[index], ...updates }

  await updateSheetData(`Users!A${index + 2}:H${index + 2}`, [
    [user.id, user.email, user.password, user.name, user.role, user.teamId || "", user.college || "", user.createdAt],
  ])
}
