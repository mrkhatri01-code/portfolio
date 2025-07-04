import { BaseManager } from "./index"

export class ClientManager extends BaseManager<any> {
  constructor() {
    super("clients")
  }

  async getFeatured(limit = 8) {
    try {
      return this.getAll({
        filter: { featured: true },
        orderBy: "name",
        orderDirection: "asc",
        limit,
      })
    } catch (error) {
      // If the featured column doesn't exist, just return all clients
      if (error instanceof Error && error.message.includes("column clients.featured does not exist")) {
        console.warn("Featured column doesn't exist, returning all clients")
        return this.getAll({
          orderBy: "name",
          orderDirection: "asc",
          limit,
        })
      }
      throw error
    }
  }
}

export const clientManager = new ClientManager()

