import type { MachineType } from '../types';

const BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

export const MACHINE_IMAGE_URLS: Record<MachineType, string> = {
  legpress:        `${BASE}/Leg_Press/0.jpg`,
  pulldown:        `${BASE}/Wide-Grip_Lat_Pulldown/0.jpg`,
  chestpress:      `${BASE}/Leverage_Chest_Press/0.jpg`,
  legextension:    `${BASE}/Leg_Extensions/0.jpg`,
  lateralraise:    `${BASE}/Cable_Seated_Lateral_Raise/0.jpg`,
  crunch:          `${BASE}/Ab_Crunch_Machine/0.jpg`,
  legcurl:         `${BASE}/Lying_Leg_Curls/0.jpg`,
  seatedrow:       `${BASE}/Leverage_High_Row/0.jpg`,
  pecdeck:         `${BASE}/Cable_Crossover/0.jpg`,
  reardelt:        `${BASE}/Cable_Rear_Delt_Fly/0.jpg`,
  hyperextension:  `${BASE}/Hyperextensions_Back_Extensions/0.jpg`,
  bicepcurl:       `${BASE}/Machine_Preacher_Curls/0.jpg`,
  calfraise:       `${BASE}/Standing_Calf_Raises/0.jpg`,
  hacksquat:       `${BASE}/Hack_Squat/0.jpg`,
  shoulderpress:   `${BASE}/Leverage_Shoulder_Press/0.jpg`,
  tricepspushdown: `${BASE}/Triceps_Pushdown/0.jpg`,
  captainschair:   `${BASE}/Hanging_Leg_Raise/0.jpg`,
  plank:           `${BASE}/Plank/0.jpg`,
};
