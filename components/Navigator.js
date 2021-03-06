export default {
  props: {
    id: {
      type: String,
      default: 'navigator'
    },
    defaultRoute: {
      type: String,
      default: '/',
    },
    defaultRouteProps: {
      type: Object,
      required: false
    },
  },
  render(h) {
    this.slotContent = this.slotContent || h(this.defaultRouteComponent, { props: this.defaultRouteProps })
    return h(
      'frame',
      {
        on: Object.assign(
          {},
          this.$listeners,
          {loaded: this.onFrameLoaded}
        ),
        attrs: {
          ...this.$attrs,
          id: this.$props.id
        },
      },
      [this.slotContent]
    )
  },
  created() {
    this.defaultRouteComponent = this.$navigator._resolveComponent(
      this.$props.defaultRoute,
      this.$props.id
    )
  },
  methods: {
    onFrameLoaded({object}) {
      if (object.__defined__custom_currentEntry) {
        // don't try do define the property multiple times
        return
      }
      object.__defined__custom_currentEntry = true

      const self = this
      let _currentEntry = object._currentEntry
      Object.defineProperty(object, '_currentEntry', {
        get() {
          return _currentEntry
        },
        set(value) {
          _currentEntry = value
          if (value && value.resolvedPage) {
            self.$navigator._updatePath(
              value.resolvedPage.__path || self.defaultRoute || '',
              self.$props.id
            )
          }
        },
      })
    },
  },
}
