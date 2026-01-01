import { BaseManager } from "./index"

export class FAQManager extends BaseManager<any> {
  constructor() {
    super("faqs")
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

export const faqManager = new FAQManager()
