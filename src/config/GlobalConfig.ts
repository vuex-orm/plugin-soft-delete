import Config from '../contracts/Config'

export const GlobalConfig: Config = {
  key: 'deleted_at',
  flagName: '$isDeleted',
  exposeFlagsExternally: true,
  mutator: null
}

export default GlobalConfig
