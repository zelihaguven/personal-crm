"use client"

import type React from "react"

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
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import { useData } from "@/contexts/data-context"

interface Course {
  id: number
  courseName: string
  instructor: string
  resource: string
  description: string
  midtermDate: string
  finalDate: string
}

export default function SchoolPage() {
  const { courses, addCourse, updateCourse, deleteCourse } = useData()

  // Remove: const [courses, setCourses] = useState<Course[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    courseName: "",
    instructor: "",
    resource: "",
    description: "",
    midtermDate: "",
    finalDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCourse) {
      updateCourse(editingCourse.id, formData)
    } else {
      addCourse(formData)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      courseName: "",
      instructor: "",
      resource: "",
      description: "",
      midtermDate: "",
      finalDate: "",
    })
    setEditingCourse(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      courseName: course.courseName,
      instructor: course.instructor,
      resource: course.resource,
      description: course.description,
      midtermDate: course.midtermDate,
      finalDate: course.finalDate,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    deleteCourse(id)
  }

  const isExamSoon = (examDate: string) => {
    const today = new Date()
    const exam = new Date(examDate)
    const diffTime = exam.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Okul Bilgileri</h1>
            <p className="text-gray-600">Ders ve sınav bilgilerinizi yönetin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Ders
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCourse ? "Dersi Düzenle" : "Yeni Ders Ekle"}</DialogTitle>
                <DialogDescription>Ders bilgilerini girin</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="courseName">Ders Adı</Label>
                  <Input
                    id="courseName"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Hoca</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="resource">Kaynak</Label>
                  <Input
                    id="resource"
                    value={formData.resource}
                    onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="midtermDate">Vize Tarihi</Label>
                  <Input
                    id="midtermDate"
                    type="date"
                    value={formData.midtermDate}
                    onChange={(e) => setFormData({ ...formData, midtermDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="finalDate">Final Tarihi</Label>
                  <Input
                    id="finalDate"
                    type="date"
                    value={formData.finalDate}
                    onChange={(e) => setFormData({ ...formData, finalDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingCourse ? "Güncelle" : "Ekle"}
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
            <CardTitle>Ders Listesi</CardTitle>
            <CardDescription>Tüm derslerinizi ve sınav tarihlerinizi görüntüleyin</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ders Adı</TableHead>
                  <TableHead>Hoca</TableHead>
                  <TableHead>Kaynak</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead>Vize Tarihi</TableHead>
                  <TableHead>Final Tarihi</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.courseName}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.resource}</TableCell>
                    <TableCell className="max-w-xs truncate">{course.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {new Date(course.midtermDate).toLocaleDateString("tr-TR")}
                        {isExamSoon(course.midtermDate) && (
                          <Badge variant="destructive" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Yakın
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {new Date(course.finalDate).toLocaleDateString("tr-TR")}
                        {isExamSoon(course.finalDate) && (
                          <Badge variant="destructive" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Yakın
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(course.id)}>
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
