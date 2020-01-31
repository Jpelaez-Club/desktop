import React from 'react'

import BodyPreview from './BodyPreview'

import { Dataset as IDataset } from '../../models/dataset'
// import { CommitDetails as ICommitDetails } from '../../models/store'
import Segment from '../chrome/Segment'
import { DetailsType } from '../../models/details'

interface BodySegmentProps {
  name?: string
  data: IDataset
}

// const datasetToCommitDetails = (d: IDataset): ICommitDetails => {
//   const c: ICommitDetails = {
//     name: d.name,
//     path: d.path,
//     peername: d.peername,
//     status: {},
//     components: {
//       meta: {
//         value: d.meta
//       },
//       structure: {
//         value: d.structure
//       },
//       readme: {
//         value: d.readme
//       },
//       commit: {
//         value: d.commit
//       },
//       body: {
//         value: d.body
//       }
//     }
//   }
//   return c
// }

const BodySegment: React.FunctionComponent<BodySegmentProps> = ({ data }) => {
  if (!data.body) {
    return null
  }

  const { structure } = data

  const previewRowsNum = structure && structure.entries < 100 ? structure.entries : 100
  const totalRows = (structure && structure.entries) || 0

  return <Segment
    icon='body'
    name='body'
    subhead={structure ? `previewing ${previewRowsNum} of ${totalRows.toLocaleString()} rows` : ''}
    content={
      <BodyPreview
        data={data}
        details={{ type: DetailsType.NoDetails }}
      />
    }/>
}

export default BodySegment
