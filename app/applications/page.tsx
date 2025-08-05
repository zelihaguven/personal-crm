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
import type { Application } from "@/contexts/data-context"

export default function ApplicationsPage() {
  const { applications, addApplication, updateApplication, deleteApplication } = useData()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    jobDescription: "",
    applicationDate: "",
    status: "Beklemede" as const,
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingApplication) {
      updateApplication(editingApplication.id, formData)
    } else {
      addApplication(formData)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      companyName: "",
      position: "",
      jobDescription: "",
      applicationDate: "",
      status: "Beklemede",
      notes: "",
    })
    setEditingApplication(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (application: Application) => {
    setEditingApplication(application)
    setFormData({
      companyName: application.companyName,
      position: application.position,
      jobDescription: application.jobDescription,
      applicationDate: application.applicationDate,
      status: application.status,
      notes: application.notes,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    deleteApplication(id)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Beklemede":
        return <Badge variant="secondary">{status}</Badge>
      case "Kabul":
        return <Badge variant="default">{status}</Badge>
      case "Red":
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">İş Başvuruları</h1>
            <p className="text-gray-600">İş başvurularınızı takip edin ve yönetin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Başvuru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingApplication ? "Başvuruyu Düzenle" : "Yeni Başvuru Ekle"}</DialogTitle>
                <DialogDescription>İş başvuru bilgilerini girin</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Firma Adı</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Pozisyon</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="jobDescription">İş Tanımı</Label>
                  <Textarea
                    id="jobDescription"
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="applicationDate">Başvuru Tarihi</Label>
                  <Input
                    id="applicationDate"
                    type="date"
                    value={formData.applicationDate}
                    onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Durum</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beklemede">Beklemede</SelectItem>
                      <SelectItem value="Kabul">Kabul</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingApplication ? "Güncelle" : "Ekle"}
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
            <CardTitle>Başvuru Listesi</CardTitle>
            <CardDescription>Tüm iş başvurularınızı görüntüleyin</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firma Adı</TableHead>
                  <TableHead>Pozisyon</TableHead>
                  <TableHead>İş Tanımı</TableHead>
                  <TableHead>Başvuru Tarihi</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Notlar</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.companyName}</TableCell>
                    <TableCell>{application.position}</TableCell>
                    <TableCell className="max-w-xs truncate">{application.jobDescription}</TableCell>
                    <TableCell>{new Date(application.applicationDate).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="max-w-xs truncate">{application.notes}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(application)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(application.id)}>
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
