import Mutator from './Mutator'

export interface Config {
  key: string
  flagName: string
  exposeFlagsExternally: boolean
  mutator: Mutator<any> | null
}

export default Config
