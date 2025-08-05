"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useData } from "@/contexts/data-context"

interface Project {
  id: number
  projectName: string
  subject: string
  postDescription: string
  blogTitle: string
  blogSubject: string
  shareDate: string
  designStatus: "Yapıldı" | "Yapılmadı"
}

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useData()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    projectName: "",
    subject: "",
    postDescription: "",
    blogTitle: "",
    blogSubject: "",
    shareDate: "",
    designStatus: "Yapılmadı" as const,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingProject) {
      updateProject(editingProject.id, formData)
    } else {
      addProject(formData)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      projectName: "",
      subject: "",
      postDescription: "",
      blogTitle: "",
      blogSubject: "",
      shareDate: "",
      designStatus: "Yapılmadı",
    })
    setEditingProject(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      projectName: project.projectName,
      subject: project.subject,
      postDescription: project.postDescription,
      blogTitle: project.blogTitle,
      blogSubject: project.blogSubject,
      shareDate: project.shareDate,
      designStatus: project.designStatus,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    deleteProject(id)
  }

  const getStatusBadge = (status: string) => {
    return status === "Yapıldı" ? (
      <Badge variant="default">{status}</Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bireysel Projeler</h1>
            <p className="text-gray-600">Kişisel projelerinizi takip edin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Proje
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingProject ? "Projeyi Düzenle" : "Yeni Proje Ekle"}</DialogTitle>
                <DialogDescription>Proje bilgilerini girin</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Proje Adı</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Konusu</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postDescription">Proje Postu Açıklaması</Label>
                  <Textarea
                    id="postDescription"
                    value={formData.postDescription}
                    onChange={(e) => setFormData({ ...formData, postDescription: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="blogTitle">Medium Blog Yazısı</Label>
                  <Input
                    id="blogTitle"
                    value={formData.blogTitle}
                    onChange={(e) => setFormData({ ...formData, blogTitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="blogSubject">Yazı Konusu</Label>
                  <Input
                    id="blogSubject"
                    value={formData.blogSubject}
                    onChange={(e) => setFormData({ ...formData, blogSubject: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shareDate">Paylaşım Tarihi</Label>
                  <Input
                    id="shareDate"
                    type="date"
                    value={formData.shareDate}
                    onChange={(e) => setFormData({ ...formData, shareDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="designStatus">Tasarım Durumu</Label>
                  <Select
                    value={formData.designStatus}
                    onValueChange={(value: any) => setFormData({ ...formData, designStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yapıldı">Yapıldı</SelectItem>
                      <SelectItem value="Yapılmadı">Yapılmadı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingProject ? "Güncelle" : "Ekle"}
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
            <CardTitle>Proje Listesi</CardTitle>
            <CardDescription>Tüm bireysel projelerinizi görüntüleyin</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proje Adı</TableHead>
                  <TableHead>Konusu</TableHead>
                  <TableHead>Proje Açıklaması</TableHead>
                  <TableHead>Blog Yazısı</TableHead>
                  <TableHead>Yazı Konusu</TableHead>
                  <TableHead>Paylaşım Tarihi</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.projectName}</TableCell>
                    <TableCell>{project.subject}</TableCell>
                    <TableCell className="max-w-xs truncate">{project.postDescription}</TableCell>
                    <TableCell className="max-w-xs truncate">{project.blogTitle}</TableCell>
                    <TableCell>{project.blogSubject}</TableCell>
                    <TableCell>{new Date(project.shareDate).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell>{getStatusBadge(project.designStatus)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
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
