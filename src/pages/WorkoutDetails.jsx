// Haya

import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, TrendingUp, ArrowLeft, Play } from 'lucide-react';
import { mockWorkouts, mockExercises } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function WorkoutDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const workout = mockWorkouts.find((w) => String(w.id) === String(id));
    const handleStartWorkout = () => {
        if (!workout)
            return;
        
        const ongoingWorkout = {
            workoutId: workout.id,
            workoutName: workout.name,
            startTime: new Date().toISOString(),
            duration: workout.duration,
            caloriesBurned: workout.caloriesBurned,
        };
        const existingWorkouts = JSON.parse(sessionStorage.getItem('ongoingWorkouts') || '[]');
        const withoutDup = existingWorkouts.filter((w) => String(w.workoutId) !== String(workout.id));
        sessionStorage.setItem('ongoingWorkouts', JSON.stringify([...withoutDup, ongoingWorkout]));
        toast({
            title: 'Workout Started!',
            description: `${workout.name} is now in progress. Check your progress page.`,
        });
        navigate('/progress');
    };
    if (!workout) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Workout Not Found</h1>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>);
    }
    
    const workoutExercises = mockExercises.filter((ex) => workout.exercises.map(String).includes(String(ex.id)));
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
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'advanced':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return '';
        }
    };
    return (<div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 -ml-2" aria-label="Back to Dashboard">
          <ArrowLeft className="mr-2 h-4 w-4"/>
          Back to Dashboard
        </Button>

        {/* Workout Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                {workout.name}
              </h1>
              <p className="text-lg text-muted-foreground">{workout.description}</p>
            </div>
            <Badge className={getCategoryColor(workout.category)} variant="outline">
              {workout.category}
            </Badge>
          </div>

          {/* Workout Stats */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground"/>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{workout.duration} minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-muted-foreground"/>
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="font-semibold">{workout.caloriesBurned} kcal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground"/>
              <div>
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <Badge className={getDifficultyColor(workout.difficulty)} variant="secondary">
                  {workout.difficulty}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={handleStartWorkout} className="flex-1" size="lg" aria-label={`Start ${workout.name} workout`}>
              <Play className="mr-2 h-5 w-5"/>
              Start Workout
            </Button>
          </div>
        </div>

        {/* Exercises Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Exercises in This Workout</h2>
          <div className="space-y-4">
            {workoutExercises.map((exercise, index) => (<Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 flex-1">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">
                          <Link to={`/exercise/${exercise.id}`} className="underline-offset-2 hover:underline" aria-label={`View details for ${exercise.name}`}>
                            {exercise.name}
                          </Link>
                        </CardTitle>
                        <CardDescription>{exercise.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(exercise.category)} variant="outline">
                      {exercise.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold mb-2">Target Muscles:</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.targetMuscles?.length ? (exercise.targetMuscles.map((muscle) => (<Badge key={muscle} variant="secondary">
                              {muscle}
                            </Badge>))) : (<span className="text-sm text-muted-foreground">—</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">Equipment:</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.equipment?.length ? (exercise.equipment.map((item) => (<Badge key={item} variant="outline">
                              {item}
                            </Badge>))) : (<span className="text-sm text-muted-foreground">No equipment needed</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">Instructions:</p>
                      {exercise.instructions?.length ? (<ol className="space-y-2">
                          {exercise.instructions.map((instruction, idx) => (<li key={idx} className="text-sm text-muted-foreground pl-5 relative">
                              <span className="absolute left-0">{idx + 1}.</span>
                              {instruction}
                            </li>))}
                        </ol>) : (<span className="text-sm text-muted-foreground">No instructions</span>)}
                    </div>
                  </div>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </div>
    </div>);
}
