# Data Management System

This document outlines the data management system used in the portfolio website. The system is designed to provide a consistent, maintainable, and efficient way to interact with the database.

## Architecture

The data management system follows a layered architecture:

1. **Data Managers**: Core classes that handle CRUD operations for each data type
2. **Server Actions**: Server-side functions that validate input and call data managers
3. **UI Components**: React components that use server actions to manage data

## Data Managers

The data managers are the foundation of the system. They provide a consistent interface for interacting with the database.

### Base Manager

The `BaseManager` class provides common functionality for all data managers:

```typescript
class BaseManager<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll(options?: QueryOptions): Promise<T[]> {
    // Implementation
  }

  async getById(id: string): Promise<T | null> {
    // Implementation
  }

  async create(data: Partial<T>): Promise<T> {
    // Implementation
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    // Implementation
  }

  async delete(id: string): Promise<void> {
    // Implementation
  }
}

