import * as React from 'react'
import { Action } from 'redux'
import { CSSTransition } from 'react-transition-group'

// import components
import Toast from './Toast'
import Onboard from './Onboard'
import AppError from './AppError'
import AppLoading from './AppLoading'
import NoDatasets from './NoDatasets'
import CreateDataset from './modals/CreateDataset'
import AddDataset from './modals/AddDataset'
import DatasetContainer from '../containers/DatasetContainer'

// import models
import { ApiAction } from '../store/api'
import { Modal, ModalType, NoModal } from '../models/modals'
import { Toast as IToast } from '../models/store'

export interface AppProps {
  hasDatasets: boolean
  loading: boolean
  sessionID: string
  peername: string
  apiConnection?: number
  hasAcceptedTOS: boolean
  hasSetPeername: boolean
  toast: IToast
  fetchSession: () => Promise<ApiAction>
  fetchMyDatasets: (page?: number, pageSize?: number) => Promise<ApiAction>
  addDataset: (peername: string, name: string) => Promise<ApiAction>
  setWorkingDataset: (peername: string, name: string, isLinked: boolean) => Promise<ApiAction>
  initDataset: (path: string, name: string, format: string) => Promise<ApiAction>
  acceptTOS: () => Action
  setHasSetPeername: () => Action
  setPeername: (newPeername: string) => Promise<ApiAction>
  closeToast: () => Action
  setApiConnection: (status: number) => Action
  pingApi: () => Promise<ApiAction>
}

interface AppState {
  currentModal: Modal
  sessionID: string
}

export default class App extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props)

    this.state = {
      currentModal: NoModal,
      sessionID: this.props.sessionID
    }

    this.setModal = this.setModal.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.renderNoDatasets = this.renderNoDatasets.bind(this)
    this.renderAppLoading = this.renderAppLoading.bind(this)
    this.renderAppError = this.renderAppError.bind(this)
  }

  componentDidMount () {
    if (this.props.apiConnection === 0) {
      var iter = 0
      const backendLoadedCheck = setInterval(() => {
        this.props.pingApi()
        iter++
        if (this.props.apiConnection === 1) clearInterval(backendLoadedCheck)
        if (iter > 20) {
          this.props.setApiConnection(-1)
          clearInterval(backendLoadedCheck)
        }
      }, 750)
    }
    this.props.fetchSession()
    this.props.fetchMyDatasets()
  }

  static getDerivedStateFromProps (NextProps: AppProps, PrevState: AppState) {
    if (PrevState.sessionID !== NextProps.sessionID) {
      return { sessionID: NextProps.sessionID }
    }
    return null
  }

  private renderModal (): JSX.Element | null {
    // Hide any dialogs while we're displaying an error
    // if (errors) {
    //   return null
    // }
    const Modal = this.state.currentModal

    return (
      <div >
        <CSSTransition
          in={ModalType.CreateDataset === Modal.type}
          classNames='fade'
          component='div'
          timeout={300}
          unmountOnExit
        >
          <CreateDataset
            onSubmit={this.props.initDataset}
            onDismissed={() => this.setState({ currentModal: NoModal })}
            setWorkingDataset={this.props.setWorkingDataset}
            fetchMyDatasets={this.props.fetchMyDatasets}
          />
        </CSSTransition>
        <CSSTransition
          in={ModalType.AddDataset === Modal.type}
          classNames='fade'
          component='div'
          timeout={300}
          unmountOnExit
        >
          <AddDataset
            onSubmit={this.props.addDataset}
            onDismissed={() => this.setState({ currentModal: NoModal })}
            setWorkingDataset={this.props.setWorkingDataset}
            fetchMyDatasets={this.props.fetchMyDatasets}
          />
        </CSSTransition>
      </div>
    )
  }

  private renderNoDatasets () {
    return (
      <CSSTransition
        in={!this.props.hasDatasets}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        < NoDatasets setModal={this.setModal}/>
      </CSSTransition>
    )
  }

  private renderAppLoading () {
    return (
      <CSSTransition
        in={this.props.loading}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        <AppLoading />
      </CSSTransition>
    )
  }

  private renderAppError () {
    return (
      <CSSTransition
        in={this.props.apiConnection === -1}
        classNames="fade"
        component="div"
        timeout={1000}
        unmountOnExit
      >
        <AppError />
      </CSSTransition>
    )
  }

  setModal (modal: Modal) {
    this.setState({ currentModal: modal })
  }

  render () {
    const {
      hasSetPeername,
      hasAcceptedTOS,
      peername,
      acceptTOS,
      setPeername,
      toast,
      closeToast,
      setHasSetPeername
    } = this.props
    return (<div style={{
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {this.renderAppLoading()}
      {this.renderAppError()}
      {this.renderModal()}
      <Onboard
        peername={peername}
        hasAcceptedTOS={hasAcceptedTOS}
        hasSetPeername={hasSetPeername}
        setHasSetPeername={setHasSetPeername}
        setPeername={setPeername}
        acceptTOS={acceptTOS}
      />
      {this.renderNoDatasets()}
      { this.props.hasDatasets && <DatasetContainer setModal={this.setModal}/> }
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.visible}
        timeout={3000}
        onClose={closeToast}
      />
    </div>)
  }
}
