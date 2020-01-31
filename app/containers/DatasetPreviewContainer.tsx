import { connect } from 'react-redux'
import Dataset from '../components/dataset/Dataset'

import Store from '../models/store'
import cities from '../../stories/data/cities.dataset.json'

const DatasetPreviewContainer = connect(
  (state: Store, props: any) => {
    const {
      ui,
      selections,
      session
    } = state

    return {
      dsref: props.dsref,
      selections,
      session,
      data: cities,
      sidebarWidth: ui.datasetSidebarWidth,
      details: ui.detailsBar
    }
  },
  {}
)(Dataset)

export default DatasetPreviewContainer
