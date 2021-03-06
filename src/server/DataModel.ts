/* ---------- COLLECTIONS ---------- */

export type Collection = 'horsos' | 'kidos' | 'trainers' | 'users' | 'diary' | 'undefined'


/* ---------- BASE ENTITIES ---------- */

export interface IKido {
  name: string, // unique!!!
  remarks?: string,
  prefs: PrefType
}

/*  Important type - defines kido preferences for horse (horso.name) selection  */
/* total no of elements $lte total number of horses in stables
the levels of match are: 'best' | 'nice' | 'ok' | 'limp' | 'excl'
last (5th) level of prefs is excludes - horses which mustn't be selected for any training */
export type PrefType = { [prefCategory: string]: string[] }
//export type PrefCategory = 'best' | 'nice' | 'isok' | 'limp' | 'excl' <- sadly cannot be use in index type signature (?)

export default class Preferences {
  static readonly allPrefCat = ['best', 'nice', 'isok', 'limp', 'excl']
  static readonly incPrefCat = ['best', 'nice', 'isok', 'limp']
  //static readonly incPrefCatRev = ['limp', 'isok', 'nice', 'best']
  //static readonly excPrefCat = ['excl']

  public static getPrefCatValue(prefCat: string): number {
    switch (prefCat) {
      case 'best':
        return 0
      case 'nice':
        return 1
      case 'isok':
        return 2
      case 'limp':
        return 3
      default:
        return -1  //'excl'
    }
  }

  public static countItemsInPrefType(prefs: PrefType): number{
    let totalLength: number = 0
    Object.keys(prefs).forEach(level => {
      totalLength += prefs[level].length
    })
    return totalLength
  }

  public static flatListForAllLevels(prefs: PrefType): string[]{
    let flatList: string[] = []
    Object.keys(prefs).forEach(level => {
      flatList = flatList.concat(prefs[level])
    })
    return flatList
  }

  public static isPrefCategory(cat: string):boolean{
    return Preferences.allPrefCat.includes(cat)
  }
}

export interface IInstructo {
  name: string // unique!!!
  descr?: string
  remarks?: string
  isDefault?: boolean
}

export interface IHorso {
  name: string // unique!!!
  maxDailyWorkload?: number
  descr?: string
  remarks?: string
}

/*export interface INewHorso extends IHorso {
  addAsHorse?: string
  addToPrefLevel?: string
}*/

/*export interface IUser extends INewUser{
  lastVisit: number,
  allVisits: number
}

export interface INewUser extends ILoginAttempt{
  email: string
}
*/

/* ---------- Horse Riding Day - QUERY ---------- */

export interface IHorseRidingDayQ {
//_id: number, //mongo id
  day: string //the same as 'name', will be part of an url format: YYYY-MM-DDxxxxx (xxxxx is optional value) ie.: '2018-10-11' (domain.pl/schedule2018-10-11) or
  dailyExcludes: string[] //unavailable horses 4e. injured
  hours: IHorseRidingHourQ[]
  remarks?: string // additional comments which would be rewritten
  timeResInMinutes: number // in the future matching engine will be handling other time resolutions ie. 30/45 minutes
}

export interface IHorseRidingHourQ {
  hour: string,
  trainer: string[],
  remarks?: string
  trainingsDetails: ITrainingQ[]
}

export interface ITrainingQ {
  kidName: string,
  horse?: string, //rewritten to result if predefined. Matched by engine if undefined
}


/* ---------- Horse Riding Day - RESULT ---------- */
export interface IHorseRidingDay {
//_id: number, //mongo id
  day: string //the same as 'name', will be part of an url ie.: '2018-10-12', '2018-10-11-a' (domain.com/diary/2018-10-11-b)
  remarks?: string // additional comments which would be
  hours: IHorseRidingHour[]
}

export interface IHorseRidingHour {
  hour: string,
  trainer: string[],
  remarks?: string,
  trainingsDetails: ITrainingDetail[]
}

export interface ITrainingDetail {
  kidName: string,
  horse: string,
  remarks?: string
}

export interface IKidHorse {
  kidName: string,
  horse: string, // undefined is default - matcher engine will handle it
}


/* ---------- HourlySearchList helpers ---------- */
export interface IKidHorseOption extends IKidHorse {
  cost: number
}

export interface IRankedHourlySolution {
  solution: IKidHorse[],
  cost: number //sum of all costs included
}


/* ---------- DailySearchList helpers ---------- */
export interface IHourlySolution {
  hourName: string
  solution: IKidHorse[]
}

export interface IHourlySolOption extends IHourlySolution {
  cost: number
}

export interface IRankedDailySolution {
  solutions: IHourlySolution[],
  cost: number //sum of all costs included
}


/* ---------- Server messages ---------- */

export interface IFrontendMsg {
  id: string
  action: ActionInMsg
  data: any
}

export interface IBackendMsg {
  replyTo?: string //id of incoming message
  success: boolean
  data: any | BackendData
}

export interface IResult extends BackendData {
  results: IHorseRidingHour[] //array of a single result for every hour in daily query
}

export interface IBestSolution extends BackendData {
  solution: IHorseRidingDay
}

export interface BackendData {
  errorMsg?: string  // max 200 chars
}

export type ActionInMsg =
  'login' | 'logout' | 'get_whole_asset' |
  //'new_user'    | 'edit_user'    | 'remove_user' | 'list_user' |
  'get_matches'  | 'save_matches' | 'remove_day' |
  'get_kid'     | 'new_kid'     | 'edit_kid'     | 'remove_kid'   | 'list_kid'  | 'haveAny_kid'  | 'prefs_template' |
  'get_horse'   | 'new_horse'   | 'edit_horse'   | 'remove_horse' | 'list_horse'  | 'haveAny_horse'  |
  'get_trainer' | 'new_trainer' | 'edit_trainer' | 'remove_trainer' | 'list_trainer' | 'haveAny_trainer'

export interface ILoginAttempt {
  userName: string // unique
  password: string // #
}