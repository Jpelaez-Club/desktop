import React from 'react'

import { Dataset as IDataset } from '../../models/dataset'

import Navbar from '../nav/Navbar'
import BodySegment from './BodySegment'
import Overview from './Overview'
import ReadmeSegment from './ReadmeSegment'
import CommitPreview from './CommitPreview'
import { ActionButtonProps } from '../chrome/ActionButton'

interface DatasetPreviewProps {
  dsref: string
  // data: IDataset
  actions?: ActionButtonProps[]
}

const DatasetPreview: React.FunctionComponent<DatasetPreviewProps> = (props) => {
  const { dsref, actions = [] } = props
  // if (!data) { return null }

  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState({})
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

  const { commit, readme } = data

  return (
    <div className='dataset'>
      {/* TODO (b5) - navbar shouldn't be loaded here, should be in App.tsx, needs location */}
      <Navbar location={''} />
      <Overview data={data} actions={actions} />
      <CommitPreview data={commit} />
      <BodySegment data={data} />
      <ReadmeSegment data={readme} />
    </div>
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
