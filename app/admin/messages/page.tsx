import Link from "next/link"
import { ArrowLeft, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createServerSupabaseClient } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"
import { deleteMessage, markMessageAsRead } from "@/app/actions/message-actions"

export default async function MessagesPage() {
  const supabase = createServerSupabaseClient()

  // Get messages
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching messages:", error)
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="-ml-4">
          <Link href="/admin/dashboard?tab=messages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      {!messages || messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No messages found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((message) => (
            <Card key={message.id} className={message.read ? "opacity-75" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{message.name}</CardTitle>
                    <a href={`mailto:${message.email}`} className="text-sm text-primary hover:underline">
                      {message.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={message.read ? "outline" : "default"}>{message.read ? "Read" : "Unread"}</Badge>
                    <div className="flex gap-1">
                      <form
                        action={async () => {
                          "use server"
                          await markMessageAsRead(message.id, !message.read)
                        }}
                      >
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          title={message.read ? "Mark as unread" : "Mark as read"}
                        >
                          {message.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </form>
                      <form
                        action={async () => {
                          "use server"
                          await deleteMessage(message.id)
                        }}
                      >
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          title="Delete message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(message.created_at)}</p>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
