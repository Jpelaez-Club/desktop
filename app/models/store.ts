import { RouterState } from 'connected-react-router'
import { Meta, Structure, Commit } from './dataset'
import { Session } from './session'
import { Details } from './details'

enum ApiConnection {
  neverConnected = 0,
  connected = 1,
  connectionFailure = -1
}

enum ModalType {
  CreateDataset,
  AddDataset,
}

export type ComponentType = 'component' | 'commit' | 'commitComponent'

type Modal =
| {
  type: ModalType.CreateDataset
  dirPath?: string
  bodyPath?: string
}
| {
  type: ModalType.AddDataset
  initialURL?: string | null
}

export interface Mutation {
  value: {
    [key: string]: any
  }
  isLoading: boolean
  error: string | null
}

export interface Mutations {
  [key: string]: Mutation
}

export type ToastType = 'success' | 'error'

export interface Toast {
  type: ToastType
  name: string
  message: string
  visible: false
}

export interface Connection {
  apiConnection: ApiConnection
  failedToFetchCount: number
}

export interface UI {
  hasAcceptedTOS: boolean
  qriCloudAuthenticated: boolean
  modal?: Modal
  showDiff: boolean
  datasetSidebarWidth: number
  collectionSidebarWidth: number
  toast: Toast
  blockMenus: boolean
  hideCommitNudge: boolean
  datasetDirPath: string
  exportPath: string
  detailsBar: Details
}

export type SelectedComponent = 'commit' | 'readme' | 'meta' | 'body' | 'structure' | 'transform' | ''

// currently selected dataset, tab, dataset component, commit, etc
export interface Selections {
  peername: string
  name: string
  activeTab: string
  component: SelectedComponent
  commit: string
  commitComponent: string
}

// info about the current value of a list being paginated
export interface PageInfo {
  isFetching: boolean
  page: number
  pageSize: number
  fetchedAll: boolean
  error?: string
}

// VersionInfo pulls details from a dataset at a specific commit in a version
// history. It's flat, plain data representation of a dataset meant for listing.
// VersionInfo is a superset of a Reference, embedding all fields a reference
// contains, and a subset of a Dataset, which fully describes a single version
export interface VersionInfo {
  // reference details
  username: string    // human-readble name of the owner of this dataset
  profileId: string   // user identifier 
  name: string        // dataset name
  path: string        // commit hash, eg: /ipfs/QmY9WcXXUnHJbYRA28LRctiL4qu4y...

  // repo locality
  fsiPath: string     // path to a local filesystem-linked directory (if exists)
  foreign: boolean    // is block data for this commit stored locally?

  // dataset version details
  metaTitle: string   // dataset meta.Title field
  themeList: string   // meta.Themes array as a "comma,separated,string"
  bodySize: number    // length of body data in bytes
  bodyRows: number    // number of rows in the body
  numErrors: number   // number of validation errors in the body
  commitTime: Date    // commit.Timestamp field, time of version creation
  
  // TODO (b5) - these are not yet supplied by the backend.
  // bodyFormat: string  //
  // numCommits: number  // 

  // TODO (b5) - need to figure out publication representation. there's tension
  // about what "publication" as a boolean means.
  // published: boolean
}

// list of local datasets
export interface MyDatasets {
  pageInfo: PageInfo
  value: VersionInfo[]
  filter: string // filter string from ui
}

export type ComponentState = 'modified' | 'unmodified' | 'removed' | 'add' | 'parse error'

// info about a dataset component as compared the same component in previous commit
export interface ComponentStatus {
  filepath: string
  status: ComponentState
  mtime?: Date
  errors?: object[]
  warnings?: object[]
  component?: string
}

export interface Pages {
  [key: string]: PageInfo
}

export interface DatasetStatus {
  [key: string]: ComponentStatus
}

export interface CommitDetails {
  path: string
  prevPath: string
  peername: string
  name: string
  status: DatasetStatus
  isLoading: boolean
  components: {
    commit: {
      value: Commit
    }
    readme: {
      value: string | undefined
      preview: string | undefined
    }
    body: {
      value: any[]
      pageInfo: PageInfo
    }
    meta: {
      value: Meta
    }
    structure: {
      value: Structure
    }
    transform: {
      value: string | undefined
    }
  }
  stats: Array<Record<string, any>>
  structure: Structure
}

export interface HistoryItem {
  author: string
  // profileID: string
  name: string
  path: string
  timestamp: Date
  title: string
}

export interface WorkingDataset extends CommitDetails {
  fsiPath: string
  hasHistory: boolean
  published: boolean
  history: History
}

export interface History {
  pageInfo: PageInfo
  value: HistoryItem[]
}

export default interface Store {
  session: Session
  connection: Connection
  ui: UI
  selections: Selections
  myDatasets: MyDatasets
  workingDataset: WorkingDataset
  commitDetails: CommitDetails
  mutations: Mutations
  router: RouterState
}
