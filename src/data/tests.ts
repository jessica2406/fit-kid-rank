
export interface Test {
  id: string;
  name: string;
  category: TestCategory;
  description: string;
  instructions: string[];
  inputs: TestInput[];
  calculateScore: (values: Record<string, number>) => number;
  getPercentile: (score: number, age: number, gender: 'male' | 'female') => number;
}

export type TestCategory = 
  | 'endurance' 
  | 'strength' 
  | 'flexibility' 
  | 'body_composition' 
  | 'agility' 
  | 'jumping' 
  | 'sprint';

export interface TestInput {
  id: string;
  label: string;
  unit: string;
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export const CATEGORIES: Record<TestCategory, { label: string, icon: string }> = {
  endurance: { label: 'Endurance & Running', icon: '🏃‍♂️' },
  strength: { label: 'Strength & Power', icon: '🏋️‍♀️' },
  flexibility: { label: 'Flexibility & Mobility', icon: '🤸‍♀️' },
  body_composition: { label: 'Body Composition', icon: '⚖️' },
  agility: { label: 'Agility & Balance', icon: '🧠' },
  jumping: { label: 'Jumping Ability', icon: '🦘' },
  sprint: { label: 'Sprint', icon: '🏃‍♂️' }
};

// Mock percentile function - in a real app, this would use actual normative data
const mockPercentile = (score: number): number => {
  return Math.min(100, Math.max(0, Math.round((score / 10) * 100)));
};

export const tests: Test[] = [
  {
    id: 'queens-college-step',
    name: "Queen's College Step Test",
    category: 'endurance',
    description: "This test estimates cardiovascular fitness by measuring heart rate recovery after stepping up and down a platform.",
    instructions: [
      "Find a 16.25-inch (41.3 cm) step or platform",
      "Step up and down for 3 minutes (males) or 3 minutes (females)",
      "Males: 24 steps per minute, Females: 22 steps per minute",
      "Immediately after completing the test, count heart rate for 15 seconds and multiply by 4"
    ],
    inputs: [
      {
        id: 'heart_rate',
        label: 'Heart Rate (15s after test)',
        unit: 'bpm',
        type: 'number',
        min: 40,
        max: 220
      }
    ],
    calculateScore: (values) => {
      const heartRate = values.heart_rate;
      return 111.33 - (0.42 * heartRate);
    },
    getPercentile: (score, age, gender) => mockPercentile(score)
  },
  {
    id: 'shuttle-run',
    name: "20 Metre Shuttle Run",
    category: 'endurance',
    description: "The shuttle run test measures aerobic endurance by having participants run back and forth between markers.",
    instructions: [
      "Place two markers 20 meters apart",
      "Run back and forth between the markers following the beeps",
      "Continue until you can no longer reach the marker before the beep sounds",
      "Record the level and shuttle you completed"
    ],
    inputs: [
      {
        id: 'level',
        label: 'Level',
        unit: '',
        type: 'number',
        min: 1,
        max: 21
      },
      {
        id: 'shuttle',
        label: 'Shuttle',
        unit: '',
        type: 'number',
        min: 1,
        max: 15
      }
    ],
    calculateScore: (values) => {
      const level = values.level;
      const speed = 8 + (level - 1) * 0.5;
      return 3.46 * speed + 14.4;
    },
    getPercentile: (score, age, gender) => mockPercentile(score)
  },
  {
    id: 'run-1-6km',
    name: "1.6 km Run Test",
    category: 'endurance',
    description: "The 1.6 km run test measures aerobic fitness by timing how long it takes to run 1.6 kilometers.",
    instructions: [
      "Mark a 1.6 kilometer course",
      "Run/walk the course as quickly as possible",
      "Record the total time in minutes and seconds"
    ],
    inputs: [
      {
        id: 'time_in_minutes',
        label: 'Time',
        unit: 'minutes',
        type: 'number',
        min: 3,
        max: 30,
        step: 0.01
      }
    ],
    calculateScore: (values) => {
      const timeInMinutes = values.time_in_minutes;
      return 132.6 - (0.387 * timeInMinutes * 60);
    },
    getPercentile: (score, age, gender) => mockPercentile(score)
  },
  {
    id: 'run-400m',
    name: "400 Metre Run Test",
    category: 'endurance',
    description: "The 400m run test measures speed endurance.",
    instructions: [
      "Mark a 400 meter course or use a standard track",
      "Run the course as quickly as possible",
      "Record the total time in seconds"
    ],
    inputs: [
      {
        id: 'time_in_seconds',
        label: 'Time',
        unit: 'seconds',
        type: 'number',
        min: 30,
        max: 300,
        step: 0.1
      }
    ],
    calculateScore: (values) => {
      return values.time_in_seconds;
    },
    getPercentile: (score, age, gender) => mockPercentile(100 - score / 2)
  },
  {
    id: 'run-800m',
    name: "800 Metre Run Test",
    category: 'endurance',
    description: "The 800m run test measures middle-distance running ability.",
    instructions: [
      "Mark an 800 meter course or use a standard track",
      "Run the course as quickly as possible",
      "Record the total time in seconds"
    ],
    inputs: [
      {
        id: 'time_in_seconds',
        label: 'Time',
        unit: 'seconds',
        type: 'number',
        min: 60,
        max: 600,
        step: 0.1
      }
    ],
    calculateScore: (values) => {
      return values.time_in_seconds;
    },
    getPercentile: (score, age, gender) => mockPercentile(100 - score / 4)
  },
  {
    id: 'squat-test',
    name: "Squat Test",
    category: 'strength',
    description: "The squat test measures lower body strength and endurance.",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Perform as many bodyweight squats as possible in 1 minute",
      "Count only proper form squats (thighs parallel to ground)"
    ],
    inputs: [
      {
        id: 'reps',
        label: 'Repetitions',
        unit: 'reps',
        type: 'number',
        min: 0,
        max: 100
      }
    ],
    calculateScore: (values) => {
      return values.reps;
    },
    getPercentile: (score, age, gender) => mockPercentile(score * 2)
  },
  {
    id: 'pull-up-test',
    name: "Pull-Up Test",
    category: 'strength',
    description: "The pull-up test measures upper body strength.",
    instructions: [
      "Hang from a bar with palms facing away",
      "Pull up until chin is above the bar",
      "Lower completely and repeat",
      "Count total number of proper form pull-ups"
    ],
    inputs: [
      {
        id: 'reps',
        label: 'Repetitions',
        unit: 'reps',
        type: 'number',
        min: 0,
        max: 50
      }
    ],
    calculateScore: (values) => {
      return values.reps;
    },
    getPercentile: (score, age, gender) => mockPercentile(score * 10)
  },
  {
    id: 'pushup-test',
    name: "Timed Push-Ups Test",
    category: 'strength',
    description: "The push-up test measures upper body strength and endurance.",
    instructions: [
      "Start in plank position with arms straight",
      "Lower until elbows are at 90 degrees",
      "Perform as many push-ups as possible in 1 minute",
      "Count only proper form push-ups"
    ],
    inputs: [
      {
        id: 'reps',
        label: 'Repetitions',
        unit: 'reps',
        type: 'number',
        min: 0,
        max: 100
      }
    ],
    calculateScore: (values) => {
      return values.reps;
    },
    getPercentile: (score, age, gender) => mockPercentile(score * 2)
  },
  {
    id: 'sit-and-reach',
    name: "Sit and Reach Test",
    category: 'flexibility',
    description: "The sit and reach test measures flexibility of the lower back and hamstrings.",
    instructions: [
      "Sit with legs extended and feet against a box",
      "Reach forward as far as possible with both hands",
      "Measure the distance reached beyond toes (positive) or before toes (negative)"
    ],
    inputs: [
      {
        id: 'cm_reached',
        label: 'Distance Reached',
        unit: 'cm',
        type: 'number',
        min: -20,
        max: 40,
        step: 0.5
      }
    ],
    calculateScore: (values) => {
      return values.cm_reached;
    },
    getPercentile: (score, age, gender) => mockPercentile((score + 20) * 2)
  },
  {
    id: 'bmi-calculation',
    name: "BMI Calculation",
    category: 'body_composition',
    description: "Body Mass Index is a measure of body fat based on height and weight.",
    instructions: [
      "Measure weight in kilograms",
      "Measure height in meters",
      "The system will calculate BMI using the formula: weight / (height^2)"
    ],
    inputs: [
      {
        id: 'weight_kg',
        label: 'Weight',
        unit: 'kg',
        type: 'number',
        min: 20,
        max: 150,
        step: 0.1
      },
      {
        id: 'height_m',
        label: 'Height',
        unit: 'm',
        type: 'number',
        min: 0.5,
        max: 2.5,
        step: 0.01
      }
    ],
    calculateScore: (values) => {
      return values.weight_kg / (values.height_m * values.height_m);
    },
    getPercentile: (score, age, gender) => {
      // For BMI, a healthy range is often considered around 18.5-24.9
      if (score < 18.5) return 50 - ((18.5 - score) * 10);
      if (score > 24.9) return 50 - ((score - 24.9) * 10);
      return 50 + ((score - 18.5) / (24.9 - 18.5) * 50);
    }
  },
  {
    id: 'illinois-agility',
    name: "Illinois Agility Test",
    category: 'agility',
    description: "The Illinois Agility Test measures agility and direction change ability.",
    instructions: [
      "Set up the course with cones as per standard Illinois test layout",
      "Start lying face down at the starting line",
      "On 'Go', complete the course as quickly as possible",
      "Record the time taken to complete the course"
    ],
    inputs: [
      {
        id: 'time_in_seconds',
        label: 'Time',
        unit: 'seconds',
        type: 'number',
        min: 10,
        max: 30,
        step: 0.01
      }
    ],
    calculateScore: (values) => {
      return values.time_in_seconds;
    },
    getPercentile: (score, age, gender) => mockPercentile(100 - (score - 10) * 5)
  },
  {
    id: 'vertical-jump',
    name: "Vertical Jump Test",
    category: 'jumping',
    description: "The vertical jump test measures leg power and explosiveness.",
    instructions: [
      "Stand next to a wall with arm extended upward",
      "Mark the highest point you can reach while standing flat-footed",
      "Jump as high as possible and touch the wall at the highest point",
      "Measure the difference between standing reach and jump height"
    ],
    inputs: [
      {
        id: 'jump_height_cm',
        label: 'Jump Height',
        unit: 'cm',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.5
      }
    ],
    calculateScore: (values) => {
      return values.jump_height_cm;
    },
    getPercentile: (score, age, gender) => mockPercentile(score * 2)
  },
  {
    id: 'sprint-50m',
    name: "50 Metre Sprint",
    category: 'sprint',
    description: "The 50m sprint test measures acceleration and speed.",
    instructions: [
      "Mark a straight 50 meter course",
      "Start from a standing position",
      "Sprint as fast as possible through the finish line",
      "Record the time to complete the distance"
    ],
    inputs: [
      {
        id: 'time_in_seconds',
        label: 'Time',
        unit: 'seconds',
        type: 'number',
        min: 5,
        max: 20,
        step: 0.01
      }
    ],
    calculateScore: (values) => {
      return values.time_in_seconds;
    },
    getPercentile: (score, age, gender) => mockPercentile(100 - (score - 5) * 7)
  }
];

export const getTestById = (id: string): Test | undefined => {
  return tests.find(test => test.id === id);
};

export const getTestsByCategory = (category: TestCategory): Test[] => {
  return tests.filter(test => test.category === category);
};

export const getAllCategories = (): TestCategory[] => {
  return Object.keys(CATEGORIES) as TestCategory[];
};
