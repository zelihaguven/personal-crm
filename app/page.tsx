"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Rocket, GraduationCap, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const { applications, communityTasks, projects, courses } = useData()
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Gerçek verilerden istatistikleri hesapla
  const stats = {
    applications: {
      total: applications.length,
      pending: applications.filter((app) => app.status === "Beklemede").length,
      accepted: applications.filter((app) => app.status === "Kabul").length,
      rejected: applications.filter((app) => app.status === "Red").length,
    },
    communityTasks: {
      total: communityTasks.length,
      completed: 0,
      pending: communityTasks.length,
    },
    projects: {
      total: projects.length,
      completed: projects.filter((p) => p.designStatus === "Yapıldı").length,
      inProgress: projects.filter((p) => p.designStatus === "Yapılmadı").length,
    },
    courses: {
      total: courses.length,
      upcoming: courses.filter((c) => {
        const today = new Date()
        const midterm = new Date(c.midtermDate)
        const final = new Date(c.finalDate)
        return midterm > today || final > today
      }).length,
      completed: courses.filter((c) => {
        const today = new Date()
        const final = new Date(c.finalDate)
        return final < today
      }).length,
    },
  }

  // Yaklaşan etkinlikleri hesapla
  const upcomingEvents = [
    ...courses.flatMap((course) => [
      {
        title: `${course.courseName} Vize Sınavı`,
        date: course.midtermDate,
        type: "Sınav" as const,
      },
      {
        title: `${course.courseName} Final Sınavı`,
        date: course.finalDate,
        type: "Sınav" as const,
      },
    ]),
    ...projects.map((project) => ({
      title: `${project.projectName} Paylaşımı`,
      date: project.shareDate,
      type: "Proje" as const,
    })),
    ...communityTasks.map((task) => ({
      title: `${task.communityName} - ${task.title}`,
      date: task.reminderDate,
      type: "Topluluk" as const,
    })),
  ]
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  // Başarı oranlarını hesapla
  const successRate =
    applications.length > 0 ? Math.round((stats.applications.accepted / applications.length) * 100) : 0

  const projectCompletionRate = projects.length > 0 ? Math.round((stats.projects.completed / projects.length) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoş geldin, {user?.firstName}! 👋</h1>
          <p className="text-gray-600">Başvurularınızı, görevlerinizi ve projelerinizi tek yerden yönetin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/applications">
            <Card className="card-shadow hover:shadow-hover transition-all duration-200 cursor-pointer bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">İş Başvuruları</CardTitle>
                <Briefcase className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.applications.total}</div>
                <div className="flex gap-2 mt-2">
                  <Badge className="status-warning">{stats.applications.pending} Beklemede</Badge>
                  <Badge className="status-accepted">{stats.applications.accepted} Kabul</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/community-tasks">
            <Card className="card-shadow hover:shadow-hover transition-all duration-200 cursor-pointer bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Topluluk Görevleri</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.communityTasks.total}</div>
                <div className="flex gap-2 mt-2">
                  <Badge className="status-pending">{stats.communityTasks.pending} Aktif</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/projects">
            <Card className="card-shadow hover:shadow-hover transition-all duration-200 cursor-pointer bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Bireysel Projeler</CardTitle>
                <Rocket className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.projects.total}</div>
                <div className="flex gap-2 mt-2">
                  <Badge className="status-completed">{stats.projects.completed} Tamamlandı</Badge>
                  <Badge className="status-new">{stats.projects.inProgress} Devam Ediyor</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/school">
            <Card className="card-shadow hover:shadow-hover transition-all duration-200 cursor-pointer bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Okul Bilgileri</CardTitle>
                <GraduationCap className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.courses.total}</div>
                <div className="flex gap-2 mt-2">
                  <Badge className="status-completed">{stats.courses.completed} Tamamlandı</Badge>
                  <Badge className="status-pending">{stats.courses.upcoming} Yaklaşan</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-shadow bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 font-semibold">
                <Calendar className="h-5 w-5 text-blue-600" />
                Yaklaşan Etkinlikler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString("tr-TR")}</p>
                      </div>
                      <Badge
                        className={
                          event.type === "Sınav"
                            ? "status-pending"
                            : event.type === "Proje"
                              ? "status-completed"
                              : "status-new"
                        }
                      >
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">Henüz yaklaşan etkinlik bulunmuyor</p>
                  <p className="text-sm mt-1">Sınav tarihleri ve görev hatırlatmaları burada görünecek</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-shadow bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 font-semibold">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {applications.length > 0 || projects.length > 0 ? "Hızlı İstatistikler" : "Hızlı Başlangıç"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length > 0 || projects.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-gray-900">
                      <span>Başvuru Başarı Oranı</span>
                      <span>{successRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${successRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-gray-900">
                      <span>Proje Tamamlama Oranı</span>
                      <span>{projectCompletionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${projectCompletionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-gray-900">
                      <span>Toplam Kayıt</span>
                      <span>{applications.length + communityTasks.length + projects.length + courses.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">CRM sisteminizi kullanmaya başlamak için:</p>

                  <Link href="/applications">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-gray-100 border-gray-200 text-gray-900"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      İlk iş başvurunuzu ekleyin
                    </Button>
                  </Link>

                  <Link href="/school">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-gray-100 border-gray-200 text-gray-900"
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Ders bilgilerinizi girin
                    </Button>
                  </Link>

                  <Link href="/projects">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-gray-100 border-gray-200 text-gray-900"
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      Bir proje planı oluşturun
                    </Button>
                  </Link>

                  <Link href="/community-tasks">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-gray-100 border-gray-200 text-gray-900"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Topluluk görevlerinizi organize edin
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
