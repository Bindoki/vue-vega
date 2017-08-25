import {compile} from 'vega-lite'
import vegaLiteCompilerDelegate from 'src/components/delegate/vegaLiteCompilerDelegate'

describe('vegaLiteCompilerDelegate', () => {
  it('should delegate to vega lite by default', () => {
    expect(vegaLiteCompilerDelegate.compileVegaLite).to.be.equal(compile)
  })
})
