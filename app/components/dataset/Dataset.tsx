import React from 'react'

import { Dataset as IDataset } from '../../models/dataset'

import Navbar from '../nav/Navbar'
import SidebarLayout from '../SidebarLayout'
import P2PConnectionStatus from '../network/P2PConnectionStatus'

import BodySegment from './BodySegment'
import Overview from './Overview'
import ReadmeSegment from './ReadmeSegment'
import StructureSegment from './StructureSegment'
import CommitPreview from './CommitPreview'
import { ActionButtonProps } from '../chrome/ActionButton'

interface DatasetPreviewProps {
  dsref: string
  data: IDataset
  actions?: ActionButtonProps[]
}

const initialDataset: IDataset = {}

const DatasetPreview: React.FunctionComponent<DatasetPreviewProps> = (props) => {
  // for demo purposes I'm *NOT& using the passed-in data prop.
  const { dsref, actions = [] } = props
  // if (!data) { return null }

  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(initialDataset)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    getPreview(dsref)
      .then(f => {
        setData(f)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        setError(error)
      })
  }, [false])
  if (error) {
    return <h3>{error}</h3>
  }
  if (loading) {
    return <h3>{loading}</h3>
  }

  // const { commit, readme } = data
  const { commit = {}, peername, name, path, structure } = data

  const mainContent = (
    <div className='main-content-flex' style={{ overflow: 'auto' }}>
      {/* TODO (b5) - navbar shouldn't be loaded here, should be in App.tsx, needs location */}
      <Navbar location={''} />
      <div className='dataset'>
        <Overview data={data} actions={actions} />
        <CommitPreview data={commit} />
        <ReadmeSegment peername={peername} name={name} path={path} collapsable />
        <StructureSegment data={structure} collapsable />
        <BodySegment data={data} collapsable />
      </div>
    </div>
  )

  return (
    <SidebarLayout
      id='collection-container'
      sidebarContent={<div className='dataset-sidebar'>
        <P2PConnectionStatus
          data={{ enabled: true }}
          onChange={(d: P2PConnection) => { alert(`change connection: ${d.enabled}`) }}
        />
      </div>}
      sidebarWidth={260}
      onSidebarResize={(width) => { setSidebarWidth('collection', width) }}
      mainContent={mainContent}
    />
  )
}

export default DatasetPreview

// TODO (b5) - this is only here for demo purposes
async function getPreview (ref: string): Promise<IDataset> {
  const options: FetchOptions = {
    method: 'GET'
  }

  const r = await fetch(`http://localhost:2503/registry/dataset/preview/${ref}`, options)
  const res = await r.json()
  if (res.meta.code !== 200) {
    var err = { code: res.meta.code, message: res.meta.error }
    throw err // eslint-disable-line
  }

  return res.data as NetworkHomeData
}
