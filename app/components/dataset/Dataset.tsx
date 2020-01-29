import React from 'react'

import { Dataset as IDataset } from '../../models/dataset'

import BodySegment from './BodySegment'
import Overview from './Overview'
import ReadmeSegment from './ReadmeSegment'
import CommitPreview from './CommitPreview'
import { ActionButtonProps } from '../chrome/ActionButton'

interface DatasetProps {
  data: IDataset
  actions?: ActionButtonProps[]
}

const Dataset: React.FunctionComponent<DatasetProps> = (props) => {
  const { data, actions = [] } = props
  if (!data) { return null }

  const { commit = {}, readme } = data

  return (
    <div className='dataset'>
      <Overview data={data} actions={actions} />
      <CommitPreview data={commit} />
      <BodySegment data={data} />
      <ReadmeSegment data={readme} />
    </div>
  )
}

export default Dataset
