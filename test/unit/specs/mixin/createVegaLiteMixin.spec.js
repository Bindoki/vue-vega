import * as vegaUtil from 'vega-util'
import createVegaLiteMixin from 'src/mixin/createVegaLiteMixin';
import MarkOptionMissedError from 'src/error/MarkOptionMissedError';
import EncodingOptionMissedError from 'src/error/EncodingOptionMissedError';

const sandbox = sinon.sandbox.create()

describe('createVegaLiteMixin', () => {
  let vegaLiteMixin

  beforeEach(() => {
    vegaLiteMixin = createVegaLiteMixin()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('beforeCreate', () => {
    let $options
    let context

    beforeEach(() => {
      $options = {
        data () {
          return {values: [1, 2, 3]}
        }
      }
    })

    it('should throw MarkOptionMissedError if option doesn\'t contain `mark` field', () => {
      context = {
        $options: Object.assign({encoding: {}}, $options)
      }

      expect(() => {
        vegaLiteMixin.beforeCreate.call(context)
      }).to.throw(MarkOptionMissedError)
    })

    it('should throw MarkOptionMissedError if option doesn\'t contain `encoding` field', () => {
      context = {
        $options: Object.assign({mark: 'blabla'}, $options)
      }

      expect(() => {
        vegaLiteMixin.beforeCreate.call(context)
      }).to.throw(EncodingOptionMissedError)
    })

    it('should create vega spec object from options', () => {
      context = {
        $options: Object.assign({encoding: {}, mark: 'blabla'}, $options)
      }

      vegaLiteMixin.beforeCreate.call(context)

      expect(context.$spec).to.deep.equal({
        '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
        data: {
          values: [1, 2, 3]
        },
        mark: 'blabla',
        encoding: {}
      })
    })
  })

  describe('created', () => {
    let View
    let view
    let parse
    let compile
    let spec
    let context
    let compilerOutput
    let runtime
    let logLevel = vegaUtil.Debug

    beforeEach(() => {
      spec = {
        data: {
          values: [
            {a: 'A', b: 28}, {a: 'B', b: 55}, {a: 'C', b: 43},
            {a: 'D', b: 91}, {a: 'E', b: 81}, {a: 'F', b: 53},
            {a: 'G', b: 19}, {a: 'H', b: 87}, {a: 'I', b: 52}
          ]
        },
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'quantitative'}
        }
      }
      context = {
        description: 'description',
        $spec: spec
      }
      compilerOutput = {
        spec: 'vegaSpecFromVegaLite'
      }
      runtime = 'runtime'

      View = sandbox.stub()
      parse = sandbox.stub()
      compile = sandbox.stub()

      view = {
        logLevel: sandbox.stub(),
        renderer: sandbox.stub(),
        hover: sandbox.stub()
      }

      view.logLevel.withArgs(logLevel).returns(view)
      view.renderer.withArgs('svg').returns(view)
      view.hover.returns(view)

      compile.withArgs(context.$spec).returns(compilerOutput)
      parse.withArgs(compilerOutput.spec).returns(runtime)
      View.withArgs(runtime).returns(view)

      vegaLiteMixin = createVegaLiteMixin({
        compile,
        parse,
        View,
        logLevel
      })
    })

    it('should add description to spec', () => {
      vegaLiteMixin.created.call(context)

      expect(context.$spec.description).to.equal(context.description)
    })

    it('should compile spec from context and pass it to parser', () => {
      vegaLiteMixin.created.call(context)

      expect(parse).to.have.been.calledWith(compilerOutput.spec)
    })

    it('should parse spec and create View within generated runtime', () => {
      vegaLiteMixin.created.call(context)

      expect(View).to.have.been.calledWith(runtime)
    })

    it('should create View instance as $vg in a context', () => {
      vegaLiteMixin.created.call(context)

      expect(context.$vg).to.equal(view)
    })

    it('should set proper log level, renderer and enable hover', () => {
      vegaLiteMixin.created.call(context)

      expect(view.logLevel).to.have.been.calledWith(logLevel)
      expect(view.renderer).to.have.been.calledWith('svg')
      expect(view.hover).to.have.been.called
    })
  })
})
