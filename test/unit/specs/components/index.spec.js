import {VegaLiteComponent} from 'src/components/index'
import vegaLiteProps from 'src/components/vegaLiteProps'
import vegaLiteComputed from 'src/components/vegaLiteComputed'

describe('Components', () => {
  describe('VegaLiteComponent', () => {
    it('should have default template', () => {
      expect(VegaLiteComponent.template).to.equal('<div></div>')
    })

    it('should have default name', () => {
      expect(VegaLiteComponent.name).to.equal('vega-lite')
    })

    it('should have default props', () => {
      expect(VegaLiteComponent.props).to.deep.equal(vegaLiteProps)
    })

    it('should have default computed', () => {
      expect(VegaLiteComponent.computed).to.deep.equal(vegaLiteComputed)
    })
  })
})
