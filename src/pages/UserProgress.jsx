//Nour
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Flame, TrendingUp, Award, Play, CheckCircle2 } from 'lucide-react';
import { mockProgressLogs, mockWorkouts, mockUsers } from '@/data/mockData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function UserProgress() {
  const { toast } = useToast();
  const currentUser = mockUsers[0];
  const userLogs = mockProgressLogs.filter((log) => log.userId === currentUser.id);
  const [ongoingWorkouts, setOngoingWorkouts] = useState([]);
  const [TemporaryLogs, setTemporaryLogs] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('ongoingWorkouts') || '[]');
    setOngoingWorkouts(stored);

    const handleBeforeUnload = () => {
      sessionStorage.removeItem('ongoingWorkouts');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleCompleteWorkout = (index) => {
    const w = ongoingWorkouts[index];

    const completedLog = {
      id: `session-completed-${w.startTime}`,
      userId: currentUser.id,
      workoutId: w.workoutId ?? null,        
      workoutName: w.workoutName,           
      date: w.startTime,                    
      duration: w.duration,
      caloriesBurned: w.caloriesBurned,
      completed: true,
      notes: 'Completed',
    };
    setTemporaryLogs((prev) => [completedLog, ...prev]);

    const updated = ongoingWorkouts.filter((_, i) => i !== index);
    setOngoingWorkouts(updated);
    sessionStorage.setItem('ongoingWorkouts', JSON.stringify(updated));

    toast({
      title: 'Workout Completed!',
      description: 'Great job! Keep up the excellent work.',
    });
  };

  const totalWorkouts = userLogs.length;
  const totalMinutes = userLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalCalories = userLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);
  const averageCaloriesPerWorkout = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;


  const inProgressSessionLogs = ongoingWorkouts.map((w, idx) => ({
    id: `session-inprogress-${idx}-${w.startTime}`,
    userId: currentUser.id,
    workoutId: w.workoutId ?? null,
    workoutName: w.workoutName,
    date: w.startTime,           
    duration: w.duration,
    caloriesBurned: w.caloriesBurned,
    completed: false,
    notes: 'In progress (this session only)',
  }));

  const combinedRecent = [...TemporaryLogs, ...inProgressSessionLogs, ...userLogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="page-title">My Progress</h1>
          <p className="text-lg text-muted-foreground">Track your fitness journey and achievements</p>
        </div>

        {/* Profile */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {currentUser.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                  <p className="text-muted-foreground">{currentUser.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {format(new Date(currentUser.joinDate), 'MMMM yyyy')}
                  </p>

                  {/* Mobile badge */}
                  <div className="mt-2 sm:hidden flex justify-center">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 inline-flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Active Member
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop badge */}
              <div className="hidden sm:flex justify-end">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 h-fit inline-flex items-center gap-1"
                >
                  <Award className="h-3 w-3" />
                  Active Member
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Workouts</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalWorkouts}</div>
              <p className="text-xs text-muted-foreground mt-1">Keep up the great work!</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMinutes}</div>
              <p className="text-xs text-muted-foreground mt-1">Minutes exercised</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Calories</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCalories}</div>
              <p className="text-xs text-muted-foreground mt-1">Calories burned</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg per Workout</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageCaloriesPerWorkout}</div>
              <p className="text-xs text-muted-foreground mt-1">Calories on average</p>
            </CardContent>
          </Card>
        </div>

        {/* Ongoing */}
        {ongoingWorkouts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ongoing Workouts</CardTitle>
              <CardDescription>Your active workout sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ongoingWorkouts.map((workout, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                        <Play className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{workout.workoutName}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{workout.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            <span>{workout.caloriesBurned} cal</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Started: {format(new Date(workout.startTime), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => handleCompleteWorkout(index)} variant="outline" size="sm">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest workout sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {combinedRecent.length > 0 ? (
              <div className="space-y-4">
                {combinedRecent.map((log) => {
                  const workout = log.workoutId
                    ? mockWorkouts.find((w) => w.id === log.workoutId)
                    : null;
                  const displayName = workout?.name ?? log.workoutName ?? 'Workout';
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {log.completed ? (
                          <Award className="h-6 w-6 text-primary" />
                        ) : (
                          <Clock className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold">{displayName}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(log.date), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                          {log.completed && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{log.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            <span>{log.caloriesBurned} cal</span>
                          </div>
                        </div>
                        {log.notes && <p className="text-sm text-muted-foreground italic">"{log.notes}"</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No workout logs yet. Start logging your workouts to track your progress!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
