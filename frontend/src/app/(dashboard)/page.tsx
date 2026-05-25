import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const stats = [
  { title: 'Total Revenue', value: 'RM 45,231', change: '+20.1%', icon: DollarSign },
  { title: 'Active Users', value: '2,350', change: '+180 this week', icon: Users },
  { title: 'New Signups', value: '1,205', change: '+19%', icon: TrendingUp },
  { title: 'Conversion Rate', value: '3.24%', change: '+0.8%', icon: BarChart3 },
]

const recentActivity = [
  { user: 'Ahmad Fikri', action: 'Created new camera group', status: 'active', time: '2 min ago' },
  { user: 'Siti Nurhaliza', action: 'Updated detection rules', status: 'active', time: '15 min ago' },
  { user: 'Rajesh Kumar', action: 'Viewed alert report', status: 'inactive', time: '1 hour ago' },
  { user: 'Lisa Wong', action: 'Added new user', status: 'active', time: '3 hours ago' },
  { user: 'Daniel Tan', action: 'Exported analytics CSV', status: 'inactive', time: '5 hours ago' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your platform activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-end gap-2">
              {[35, 60, 45, 80, 55, 90, 70, 95, 65, 85, 75, 100].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-primary/60 transition-colors hover:bg-primary"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
              <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Camera Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center gap-8">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-primary/20 border-t-primary">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">78%</div>
                  <div className="text-xs text-muted-foreground">Online</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Online', value: 156, color: 'bg-primary' },
                  { label: 'Offline', value: 32, color: 'bg-destructive' },
                  { label: 'Maintenance', value: 12, color: 'bg-warning' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="ml-auto text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((row) => (
                <TableRow key={row.user}>
                  <TableCell className="font-medium">{row.user}</TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}