import vegaDelegate from 'src/components/delegate/vegaDelegate'
import simpleBarSpec from 'spec/vega/bar-simple.vg.json'
import {DEFAULT_DATA_SOURCE_NAME} from 'src/constants'

describe('vegaViewDelegate', () => {
  const sandbox = sinon.sandbox.create()
  let vegaView
  let element
  let {
    createVegaView,
    mountVegaView,
    destroyVegaView,
    streamDataToVegaView
  } = vegaDelegate

  beforeEach(() => {
    vegaView = {
      initialize: sandbox.stub(),
      run: sandbox.stub(),
      finalize: sandbox.stub()
    }

    element = 'el'

    vegaView.initialize.returns(vegaView)
    vegaView.run.returns(vegaView)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should initialize vega view within provided element', () => {
    mountVegaView(vegaView, element)

    expect(vegaView.initialize).to.have.been.calledWith(element)
    expect(vegaView.run).to.have.been.calledAfter(vegaView.initialize)
  })

  it('should destroy vega view', () => {
    destroyVegaView(vegaView)

    expect(vegaView.finalize).to.have.been.called
  })

  it('should create vega view', () => {
    // TODO: in #22, we want to change that partial got proper function
    vegaView = createVegaView(simpleBarSpec)

    expect(vegaView).to.be.ok
  })

  describe('stream data to vega view', () => {
    let changeset
    let dataSetName
    let vegaSpec
    let nextData
    let prevData

    beforeEach(() => {
      vegaView = {
        change: sandbox.stub(),
        run: sandbox.stub(),
        data: sandbox.stub()
      }
      vegaView.change.returns(vegaView)

      dataSetName = DEFAULT_DATA_SOURCE_NAME

      vegaSpec = {
        data: [{name: dataSetName}]
      }

      nextData = [1, 2, 3]
      prevData = [-3, -2, -1]

      changeset = sandbox.stub()
      changeset.remove = sandbox.stub().returns(changeset)
      changeset.insert = sandbox.stub().returns(changeset)
      changeset.returns(changeset)

      vegaView.data.withArgs(dataSetName).returns(prevData)
    })

    it('should remove previous and insert next data to changeset', () => {
      streamDataToVegaView(vegaView, nextData, prevData, vegaSpec, changeset)

      expect(changeset.remove).to.have.been.calledWith(prevData)
      expect(changeset.remove).to.have.been.calledBefore(changeset.insert)
      expect(changeset.insert).to.have.been.calledWith(nextData)
    })

    it('should change view`s dataset and trigger re-render', () => {
      streamDataToVegaView(vegaView, nextData, prevData, vegaSpec, changeset)

      expect(vegaView.change).to.have.been.calledWith(dataSetName, changeset)
      expect(vegaView.change).to.have.been.calledBefore(vegaView.run)
      expect(vegaView.run).to.have.been.called
    })
  })
})
