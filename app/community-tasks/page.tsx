"use client"

import type React from "react"
import { useData } from "@/contexts/data-context"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"

interface CommunityTask {
  id: number
  communityName: string
  title: string
  weeklyTasks: string
  notes: string
  reminderDate: string
}

export default function CommunityTasksPage() {
  const { communityTasks, addCommunityTask, updateCommunityTask, deleteCommunityTask } = useData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<CommunityTask | null>(null)
  const [formData, setFormData] = useState({
    communityName: "",
    title: "",
    weeklyTasks: "",
    notes: "",
    reminderDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTask) {
      updateCommunityTask(editingTask.id, formData)
    } else {
      addCommunityTask(formData)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      communityName: "",
      title: "",
      weeklyTasks: "",
      notes: "",
      reminderDate: "",
    })
    setEditingTask(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (task: CommunityTask) => {
    setEditingTask(task)
    setFormData({
      communityName: task.communityName,
      title: task.title,
      weeklyTasks: task.weeklyTasks,
      notes: task.notes,
      reminderDate: task.reminderDate,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    deleteCommunityTask(id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Topluluk Görevleri</h1>
            <p className="text-gray-600">Topluluk içindeki görevlerinizi yönetin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Görev
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTask ? "Görevi Düzenle" : "Yeni Görev Ekle"}</DialogTitle>
                <DialogDescription>Topluluk görev bilgilerini girin</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="communityName">Topluluk Adı</Label>
                  <Input
                    id="communityName"
                    value={formData.communityName}
                    onChange={(e) => setFormData({ ...formData, communityName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Ünvan</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="weeklyTasks">Haftalık Görevler</Label>
                  <Textarea
                    id="weeklyTasks"
                    value={formData.weeklyTasks}
                    onChange={(e) => setFormData({ ...formData, weeklyTasks: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="reminderDate">Hatırlatma Tarihi</Label>
                  <Input
                    id="reminderDate"
                    type="date"
                    value={formData.reminderDate}
                    onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingTask ? "Güncelle" : "Ekle"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    İptal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Görev Listesi</CardTitle>
            <CardDescription>Tüm topluluk görevlerinizi görüntüleyin</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topluluk Adı</TableHead>
                  <TableHead>Ünvan</TableHead>
                  <TableHead>Haftalık Görevler</TableHead>
                  <TableHead>Notlar</TableHead>
                  <TableHead>Hatırlatma Tarihi</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communityTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.communityName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.title}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{task.weeklyTasks}</TableCell>
                    <TableCell className="max-w-xs truncate">{task.notes}</TableCell>
                    <TableCell>{new Date(task.reminderDate).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
