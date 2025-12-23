"use client"

import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">이벤트 수정</h1>
            <p className="text-sm text-muted-foreground">이벤트 ID: {eventId}</p>
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground">이벤트 수정 폼이 여기에 표시됩니다.</p>
          <p className="text-sm text-muted-foreground mt-2">이벤트 생성 폼과 유사한 UI가 구현될 예정입니다.</p>
        </div>
      </div>
    </div>
  )
}
