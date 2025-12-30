// AI Workout Generator - Uses Claude to create adaptive workouts

import { claudeClient } from './claudeClient';
import { CheckIn } from '@/types/checkin';
import { Workout, Exercise, WorkoutType } from '@/types/workout';
import { EXERCISES } from '@/constants/exercises';

export class WorkoutGenerator {
  /**
   * Generate a workout based on check-in data
   */
  async generateWorkout(checkIn: CheckIn): Promise<Workout> {
    const prompt = this.buildPrompt(checkIn);
    const systemPrompt = this.getSystemPrompt();
    
    try {
      const response = await claudeClient.sendMessage(prompt, systemPrompt, 3000);
      
      // Parse AI response into structured workout
      const workout = this.parseWorkoutFromAI(response.content, checkIn);
      
      return workout;
    } catch (error) {
      console.error('❌ Workout generation failed:', error);
      // Return fallback workout
      return this.getFallbackWorkout(checkIn);
    }
  }
  
  /**
   * Build the prompt for Claude based on check-in
   */
  private buildPrompt(checkIn: CheckIn): string {
    const { physical, mental, emotional } = checkIn;
    
    return `Generate today's workout based on this morning's check-in:

PHYSICAL STATE:
- Left knee: ${physical.knee}/10 ${physical.knee < 5 ? '⚠️ PAINFUL' : physical.knee < 7 ? '⚠️ SORE' : '✅ OKAY'}
- Shoulder: ${physical.shoulder}/10 ${physical.shoulder < 5 ? '⚠️ PAINFUL' : physical.shoulder < 7 ? '⚠️ SORE' : '✅ OKAY'}
- Energy: ${physical.energy}/10 ${physical.energy < 5 ? '😴 LOW' : physical.energy < 7 ? '😌 MODERATE' : '🔥 HIGH'}
- Sleep quality: ${physical.sleep}/10 ${physical.sleep < 6 ? '😴 POOR' : physical.sleep < 8 ? '😌 DECENT' : '💤 GREAT'}
${physical.weight ? `- Weight: ${physical.weight} lbs` : ''}

MENTAL STATE:
- State: ${mental.state} ${mental.state === 'anxious' ? '😰' : mental.state === 'clear' ? '😌' : '🤔'}
- Stress level: ${mental.stress}/10 ${mental.stress > 7 ? '⚠️ HIGH' : mental.stress > 4 ? '😌 MODERATE' : '✅ LOW'}
- Mental clarity: ${mental.clarity}/10

EMOTIONAL STATE:
- Primary emotion: ${emotional.primary} ${this.getEmotionEmoji(emotional.primary)}
- Intensity: ${emotional.intensity}/10

AVAILABLE EQUIPMENT:
- Echelon Row machine (ECH-ROW-026782)
- Resistance bands (light, medium, heavy)
- Cable machine
- Stability ball
- Free weights (5-45 lbs)

PROVIDE WORKOUT IN THIS EXACT JSON FORMAT:
\`\`\`json
{
  "type": "upper_body" | "lower_body" | "full_body" | "cardio" | "recovery",
  "estimatedDuration": <number in minutes>,
  "reasoning": "<1-2 sentences why this workout today>",
  "warmup": {
    "exercises": [
      {
        "name": "<exercise name>",
        "equipment": "rowing_machine" | "resistance_bands" | "cables" | "stability_ball" | "free_weights" | "bodyweight",
        "duration": <minutes if timed, or null>,
        "reps": <number or null>,
        "sets": 1,
        "restSeconds": 0,
        "formCues": ["<cue 1>", "<cue 2>"],
        "instructions": "<brief instructions>"
      }
    ]
  },
  "strength": {
    "exercises": [
      {
        "name": "<exercise name from equipment>",
        "equipment": "<equipment type>",
        "sets": <number>,
        "reps": <number>,
        "targetWeight": <number in lbs or null>,
        "restSeconds": <60-120>,
        "formCues": ["<important form cue 1>", "<important form cue 2>"],
        "modifications": "<knee/shoulder adaptations if needed>"
      }
    ]
  },
  "cooldown": {
    "exercises": [
      {
        "name": "<stretch or light exercise>",
        "duration": <minutes>,
        "instructions": "<how to do it>"
      }
    ]
  },
  "coachingNotes": "<Encouraging 1-2 sentence message to Owen>"
}
\`\`\`

CRITICAL RULES:
1. If knee < 5/10: NO leg exercises (squats, lunges, leg press)
2. If shoulder < 5/10: NO overhead pressing, use bands instead of cables
3. If stress > 7/10: START with 10-15 min contemplative rowing (proven to reduce his anxiety)
4. If energy < 5/10: Reduce total volume by 30%, focus on quality over quantity
5. If sleep < 6/10: Moderate intensity, avoid going to failure
6. ALWAYS include at least 5 min of rowing (warm-up or cardio)
7. Total workout: 30-40 minutes including warm-up and cool-down
8. Use exercises that are actually available (check equipment list)
9. Provide ONLY the JSON, no other text

Generate the workout now:`;
  }
  
  /**
   * System prompt for workout generation
   */
  private getSystemPrompt(): string {
    return `You are an expert fitness coach specializing in adaptive training for 50+ adults with joint issues.

Your task: Generate a safe, effective workout in JSON format based on daily check-in data.

Key principles:
1. SAFETY FIRST - never risk injury for gains
2. ADAPT TO STATE - same person, different capacities daily
3. PROGRESSIVE - but patient and sustainable
4. JOINT-FRIENDLY - always provide modifications
5. ROWING IS THERAPEUTIC - use it strategically for both cardio and stress relief

Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.`;
  }
  
  /**
   * Parse Claude's response into a Workout object
   */
  private parseWorkoutFromAI(aiResponse: string, checkIn: CheckIn): Workout {
    try {
      // Remove markdown code fences if present
      let cleaned = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const parsed = JSON.parse(cleaned);
      
      // Transform to Workout type
      const workout: Workout = {
        id: this.generateId(),
        date: new Date(),
        type: parsed.type as WorkoutType,
        estimatedDuration: parsed.estimatedDuration,
        reasoning: parsed.reasoning,
        exercises: [
          ...this.transformExercises(parsed.warmup.exercises, 'warmup'),
          ...this.transformExercises(parsed.strength.exercises, 'strength'),
          ...this.transformExercises(parsed.cooldown.exercises, 'cooldown'),
        ],
        completed: false,
        coachingNotes: parsed.coachingNotes,
        checkInId: checkIn.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      return workout;
    } catch (error) {
      console.error('❌ Failed to parse AI workout:', error);
      console.error('AI Response:', aiResponse);
      throw new Error('AI generated invalid workout format');
    }
  }
  
  /**
   * Transform exercises from AI format to app format
   */
  private transformExercises(exercises: any[], phase: string): Exercise[] {
    return exercises.map(ex => ({
      id: this.generateId(),
      name: ex.name,
      equipment: ex.equipment || 'bodyweight',
      phase: phase as any,
      sets: this.createSets(ex.sets || 1, ex.reps, ex.targetWeight, ex.restSeconds || 60),
      formCues: ex.formCues || [],
      modifications: ex.modifications,
      instructions: ex.instructions,
      duration: ex.duration,
    }));
  }
  
  /**
   * Create exercise sets array
   */
  private createSets(numSets: number, reps: number, weight?: number, rest: number = 90): any[] {
    return Array(numSets).fill(null).map(() => ({
      targetReps: reps,
      actualReps: undefined,
      targetWeight: weight,
      actualWeight: undefined,
      restSeconds: rest,
      completed: false,
      difficulty: undefined,
      notes: undefined,
    }));
  }
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get emoji for emotion
   */
  private getEmotionEmoji(emotion: string): string {
    const emojiMap: Record<string, string> = {
      'peaceful': '😌',
      'anxious': '😰',
      'frustrated': '😤',
      'sad': '😢',
      'joyful': '😊',
      'numb': '😐',
    };
    return emojiMap[emotion] || '🤔';
  }
  
  /**
   * Fallback workout if AI fails
   */
  private getFallbackWorkout(checkIn: CheckIn): Workout {
    const { physical } = checkIn;
    
    // Safe, basic workout
    return {
      id: this.generateId(),
      date: new Date(),
      type: 'upper_body',
      estimatedDuration: 30,
      reasoning: 'Basic upper body workout (AI temporarily unavailable)',
      exercises: [
        {
          id: this.generateId(),
          name: 'Easy Rowing',
          equipment: 'rowing_machine',
          phase: 'warmup',
          sets: [{
            targetReps: 0,
            restSeconds: 0,
            completed: false,
          }],
          duration: 5,
          formCues: ['Easy pace', 'Focus on form'],
        },
        {
          id: this.generateId(),
          name: 'Band Chest Press',
          equipment: 'resistance_bands',
          phase: 'strength',
          sets: this.createSets(3, 12, undefined, 60),
          formCues: ['Control the movement', 'Full range of motion'],
        },
        {
          id: this.generateId(),
          name: 'Band Row',
          equipment: 'resistance_bands',
          phase: 'strength',
          sets: this.createSets(3, 12, undefined, 60),
          formCues: ['Pull elbows back', 'Squeeze shoulder blades'],
        },
      ],
      completed: false,
      coachingNotes: 'Safe basic workout. We\'ll get the AI working soon!',
      checkInId: checkIn.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export const workoutGenerator = new WorkoutGenerator();
