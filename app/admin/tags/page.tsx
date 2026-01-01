"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createClientSupabaseClient } from "@/lib/supabase"
import { createTag, updateTag, deleteTag } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit } from "lucide-react"

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    const supabase = createClientSupabaseClient()
    const { data } = await supabase.from("blog_tags").select("*").order("name")
    if (data) setTags(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let result
      if (editingId) {
        result = await updateTag(editingId, name)
      } else {
        result = await createTag(name)
      }

      if (result.success) {
        toast({ title: result.message })
        fetchTags()
        setName("")
        setEditingId(null)
      }
    } catch (error) {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tag?")) return

    const result = await deleteTag(id)
    if (result.success) {
      toast({ title: result.message })
      fetchTags()
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tags</h1>
            <p className="text-muted-foreground">Manage blog tags</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Tag" : "New Tag"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Tag Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tag name" required />
                </div>
                <Button type="submit">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : tags.length === 0 ? (
          <Card className="p-6 text-center">
            <p>No tags yet</p>
          </Card>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Card key={tag.id} className="p-3 flex items-center gap-2">
                <span>{tag.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingId(tag.id)
                    setName(tag.name)
                  }}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(tag.id)}>
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
