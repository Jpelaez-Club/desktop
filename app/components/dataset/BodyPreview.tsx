import React from 'react'

import { DetailsType } from '../../models/details'
import { Dataset } from '../../models/dataset'

export interface BodyProps {
  data: Dataset
  details: DetailsType
}

const BodyPreview: React.FunctionComponent<BodyProps> = ({ data }) => {
  return <div id='body-table-container' >
    <table style={{ display: 'table' }}>
      {/* <thead>
        <tr>
          <th>
            <div className='cell'>&nbsp;</div>
          </th>
          {headers && headers.map((d: any, j: number) => {
            return (
              <th key={j} className={(j === highlighedColumnIndex) ? 'highlighted' : '' }>
                <div className='cell' onClick={() => setDetailsBar(j)}>
                  <TypeLabel type={d.type} showLabel={false}/>&nbsp;{d.title}
                </div>
              </th>
            )
          })}
        </tr>
      </thead> */}
      <tbody>
        {data.body.map((row, i) => {
          return (
            <tr key={i}>
              {row.map((d: any, j: number) => {
                const isFirstColumn = j === 0
                if (isFirstColumn) d = parseInt(d) + 1
                return (
                  <td key={j} className={isFirstColumn ? 'first-column' : ''}>
                    <div className='cell'>{typeof d === 'boolean' ? JSON.stringify(d) : d}</div>
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
}

export default BodyPreview
