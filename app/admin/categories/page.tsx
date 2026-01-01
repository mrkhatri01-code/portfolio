"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createClientSupabaseClient } from "@/lib/supabase"
import { createCategory, updateCategory, deleteCategory } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit } from "lucide-react"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const supabase = createClientSupabaseClient()
    const { data } = await supabase.from("blog_categories").select("*").order("name")
    if (data) setCategories(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let result
      if (editingId) {
        result = await updateCategory(editingId, formData.name, formData.description)
      } else {
        result = await createCategory(formData.name, formData.description)
      }

      if (result.success) {
        toast({ title: result.message })
        fetchCategories()
        setFormData({ name: "", description: "" })
        setEditingId(null)
      } else {
        toast({ title: result.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return

    const result = await deleteCategory(id)
    if (result.success) {
      toast({ title: result.message })
      fetchCategories()
    } else {
      toast({ title: result.message, variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Categories</h1>
            <p className="text-muted-foreground">Manage blog categories</p>
          </div>
          <Dialog open={editingId === null && false} onOpenChange={(open) => !open && setEditingId(null)}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Category" : "New Category"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Category name"
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Category description"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <Button type="submit">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : categories.length === 0 ? (
          <Card className="p-6 text-center">
            <p>No categories yet</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {categories.map((cat) => (
              <Card key={cat.id} className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{cat.name}</h3>
                  {cat.description && <p className="text-sm text-muted-foreground">{cat.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(cat.id)
                      setFormData({ name: cat.name, description: cat.description })
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
