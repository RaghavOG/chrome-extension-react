"use client"

import { CalendarDays, Clock, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"



const sessionalExams = [
  {
    subject: "Applied Probability and Random Processes",
    date: "21 April 2025",
    day: "Monday",
    time: "12:00 - 1:30 PM",
  },
  { subject: "Object Oriented Programming using Java", date: "22 April 2025", day: "Tuesday", time: "12:00 - 1:30 PM" },
  { subject: "Database Management Systems", date: "23 April 2025", day: "Wednesday", time: "12:00 - 1:30 PM" },
  { subject: "Supervised & Unsupervised Learning", date: "24 April 2025", day: "Thursday", time: "12:00 - 1:30 PM" },
  { subject: "Optimization Techniques", date: "25 April 2025", day: "Friday", time: "12:00 - 1:30 PM" },
]

const endTermExams = [
  { subject: "Optimization Techniques", date: "17 May 2025", day: "Saturday", time: "12:00 - 1:30 PM" },
  { subject: "Supervised & Unsupervised Learning", date: "21 May 2025", day: "Wednesday", time: "12:00 - 1:30 PM" },
  { subject: "Database Management Systems", date: "23 May 2025", day: "Friday", time: "12:00 - 1:30 PM" },
  { subject: "Applied Probability and Random Processes", date: "26 May 2025", day: "Monday", time: "12:00 - 1:30 PM" },
  { subject: "Object Oriented Programming using Java", date: "29 May 2025", day: "Thursday", time: "12:00 - 1:30 PM" },
]

// Add holidays between exams
const getFullSchedule = (exams) => {
  const fullSchedule = []

  for (let i = 0; i < exams.length; i++) {
    fullSchedule.push(exams[i])

    // Add holidays between exams if there's a gap
    if (i < exams.length - 1) {
      const currentDate = new Date(exams[i].date)
      const nextDate = new Date(exams[i + 1].date)
      const dayDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))

      if (dayDiff > 1) {
        for (let j = 1; j < dayDiff; j++) {
          const holidayDate = new Date(currentDate)
          holidayDate.setDate(currentDate.getDate() + j)

          const options = { weekday: "long" }
          const dayName = holidayDate.toLocaleDateString("en-US", options)

          const formattedDate = holidayDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })

          fullSchedule.push({
            subject: "No Exam",
            date: formattedDate,
            day: dayName,
            time: "N/A",
            isHoliday: true,
          })
        }
      }
    }
  }

  return fullSchedule
}

const sessionalFullSchedule = getFullSchedule(sessionalExams)
const endTermFullSchedule = getFullSchedule(endTermExams)

export default function ExamSchedule() {
  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">
            📝 Exam Schedule
          </h1>

          <Tabs defaultValue="sessional" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5">
              <TabsTrigger
                value="sessional"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-white"
              >
                Sessional Exams
              </TabsTrigger>
              <TabsTrigger
                value="endterm"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-white"
              >
                End Term Exams
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sessional">
              <Card className="backdrop-blur-sm bg-transparent border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Sessional Exams (April 21-25, 2025)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessionalFullSchedule.map((exam, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          exam.isHoliday ? "border-white/5 bg-white/5" : "border-white/10 bg-white/10"
                        } 
                          transition-all duration-300 hover:bg-white/15`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-full ${
                                exam.isHoliday ? "bg-gray-500/20" : "bg-gradient-to-br from-cyan-500/20 to-pink-500/20"
                              } 
                              border border-white/10`}
                            >
                              {exam.isHoliday ? (
                                <CalendarDays className="h-6 w-6 text-gray-400" />
                              ) : (
                                <BookOpen className="h-6 w-6 text-cyan-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h2
                                  className={`text-xl font-semibold ${exam.isHoliday ? "text-gray-400" : "text-white"}`}
                                >
                                  {exam.subject}
                                </h2>
                                {exam.isHoliday && (
                                  <Badge variant="outline" className="text-gray-400 border-gray-500">
                                    Holiday
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <CalendarDays
                                  className={`h-4 w-4 ${exam.isHoliday ? "text-gray-500" : "text-white/60"}`}
                                />
                                <p className={`text-sm ${exam.isHoliday ? "text-gray-500" : "text-white/60"}`}>
                                  {exam.date} ({exam.day})
                                </p>
                              </div>
                            </div>
                          </div>

                          {!exam.isHoliday && (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                              <Clock className="h-4 w-4 text-cyan-400" />
                              <span className="text-white/80">{exam.time}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endterm">
              <Card className="backdrop-blur-sm bg-transparent border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">End Term Exams (May 17-29, 2025)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {endTermFullSchedule.map((exam, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          exam.isHoliday ? "border-white/5 bg-white/5" : "border-white/10 bg-white/10"
                        } 
                          transition-all duration-300 hover:bg-white/15`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-full ${
                                exam.isHoliday ? "bg-gray-500/20" : "bg-gradient-to-br from-cyan-500/20 to-pink-500/20"
                              } 
                              border border-white/10`}
                            >
                              {exam.isHoliday ? (
                                <CalendarDays className="h-6 w-6 text-gray-400" />
                              ) : (
                                <BookOpen className="h-6 w-6 text-cyan-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h2
                                  className={`text-xl font-semibold ${exam.isHoliday ? "text-gray-400" : "text-white"}`}
                                >
                                  {exam.subject}
                                </h2>
                                {exam.isHoliday && (
                                  <Badge variant="outline" className="text-gray-400 border-gray-500">
                                    Holiday
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <CalendarDays
                                  className={`h-4 w-4 ${exam.isHoliday ? "text-gray-500" : "text-white/60"}`}
                                />
                                <p className={`text-sm ${exam.isHoliday ? "text-gray-500" : "text-white/60"}`}>
                                  {exam.date} ({exam.day})
                                </p>
                              </div>
                            </div>
                          </div>

                          {!exam.isHoliday && (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                              <Clock className="h-4 w-4 text-cyan-400" />
                              <span className="text-white/80">{exam.time}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
