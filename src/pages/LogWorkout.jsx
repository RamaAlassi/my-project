//Nour
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Flame, Save, ArrowLeft } from 'lucide-react';
import { mockExercises } from '@/data/mockData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function LogWorkout() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [date, setDate] = useState(new Date());

  // Calculate totals based on selected exercises
  const totalDuration = selectedExercises.reduce((sum, id) => {
    const exercise = mockExercises.find((ex) => ex.id === id);
    return sum + (exercise?.duration || 10);
  }, 0);

  const totalCalories = selectedExercises.reduce((sum, id) => {
    const exercise = mockExercises.find((ex) => ex.id === id);
    return sum + (exercise?.caloriesBurned || 50);
  }, 0);

  const handleExerciseToggle = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const handleSubmit = () => {
    if (!workoutName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a workout name',
        variant: 'destructive',
      });
      return;
    }
    if (selectedExercises.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one exercise',
        variant: 'destructive',
      });
      return;
    }

    const customWorkout = {
      id: `custom-${Date.now()}`,
      name: workoutName,
      category: 'strength',
      duration: totalDuration,
      difficulty: 'intermediate',
      exercises: selectedExercises,
      description: `Custom workout with ${selectedExercises.length} exercises`,
      caloriesBurned: totalCalories,
      date: date.toISOString(),
    };

    toast({
      title: 'Success',
      description: `Workout "${workoutName}" logged successfully!`,
    });

    setWorkoutName('');
    setSelectedExercises([]);
    setDate(new Date());

    navigate('/dashboard', { state: { newlyAddedWorkout: customWorkout } });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'strength':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'cardio':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'flexibility':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="page-title">Log New Workout</h1>
          <p className="text-lg text-muted-foreground">
            Select exercises and create your workout session
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workout Details */}
            <Card>
              <CardHeader>
                <CardTitle>Workout Details</CardTitle>
                <CardDescription>Name your workout and select the date</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="workout-name">Workout Name *</Label>
                  <Input
                    id="workout-name"
                    placeholder="e.g., Morning Upper Body Session"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(date, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Exercises</CardTitle>
                <CardDescription>
                  Choose exercises for this workout ({selectedExercises.length} selected)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {mockExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={exercise.id}
                        checked={selectedExercises.includes(exercise.id)}
                        onCheckedChange={() => handleExerciseToggle(exercise.id)}
                        className="mt-1"
                      />
                      <label htmlFor={exercise.id} className="flex-1 cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {exercise.description}
                            </p>
                          </div>
                          <Badge className={getCategoryColor(exercise.category)} variant="outline">
                            {exercise.category}
                          </Badge>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Workout Summary</CardTitle>
                <CardDescription>Estimated totals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-2xl font-bold">{totalDuration} min</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                      <Flame className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Calories</p>
                      <p className="text-2xl font-bold">{totalCalories} kcal</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm font-semibold">Selected Exercises:</p>
                  {selectedExercises.length > 0 ? (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {selectedExercises.map((id) => {
                        const exercise = mockExercises.find((ex) => ex.id === id);
                        return exercise ? <li key={id}>• {exercise.name}</li> : null;
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No exercises selected</p>
                  )}
                </div>

                <Button onClick={handleSubmit} className="w-full" size="lg">
                  <Save className="mr-2 h-5 w-5" />
                  Log Workout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
