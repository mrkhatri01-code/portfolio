import { BaseManager } from "./index"

export class ResourceManager extends BaseManager<any> {
  constructor() {
    super("recommended_resources")
  }

  async getOrdered() {
    return this.getAll({
      orderBy: "display_order",
      orderDirection: "asc",
    })
  }

  async updateOrder(id: string, newOrder: number) {
    return this.update(id, { display_order: newOrder })
  }
}

export const resourceManager = new ResourceManager()
