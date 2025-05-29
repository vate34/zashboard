import {
  deleteConfigFileAPI,
  getClashAPIendpointAPI,
  getConfigFileAPI,
  getConfigListAPI,
  getRuntimeConfigFileAPI,
  isAutoLaunchEnabledAPI,
  isCoreRunningAPI,
  isServiceModeInstalledAPI,
  setConfigAPI,
} from '@/renderer/src/api/ipc-invoke'
import { Config } from '@/shared/type'
import { computed, ref } from 'vue'
import { addBackend, backendList } from './setup'

export const isCoreRunning = ref(false)
export const fetchIsCoreRunning = async () => {
  const isRunning = await isCoreRunningAPI()

  if (isRunning) {
    const endpoint = await getClashAPIendpointAPI()

    backendList.value = []
    addBackend({
      host: '127.0.0.1',
      port: '9090',
      protocol: 'http',
      secondaryPath: '',
      password: endpoint.secret,
    })
  }
  isCoreRunning.value = isRunning
}
fetchIsCoreRunning()

export const isAutoLaunchEnabled = ref(false)
export const fetchIsAutoLaunchEnabled = async () => {
  isAutoLaunchEnabled.value = await isAutoLaunchEnabledAPI()
}
fetchIsAutoLaunchEnabled()

export const isServiceModeInstalled = ref(false)
export const fetchIsServiceModeInstalled = async () => {
  isServiceModeInstalled.value = await isServiceModeInstalledAPI()
}
fetchIsServiceModeInstalled()

export const configFileList = ref<Config[]>([])
export const activeConfigName = computed(
  () => configFileList.value.find((f) => f.isActive)?.name || '',
)
export const fetchConfigFileList = async () => {
  configFileList.value = await getConfigListAPI()
  const active = configFileList.value.find((f) => f.isActive)

  if (!active) {
    configFile.value = ''
    return
  }

  fetchConfigFileWithName(active.name)
}
export const setConfig = async (config: Config, content?: string) => {
  await setConfigAPI(config, content)
  await fetchConfigFileList()
}
export const removeConfig = async (name: string) => {
  await deleteConfigFileAPI(name)
  await fetchConfigFileList()
}

export const configFile = ref('')
export const fetchRunningConfigFile = async () => {
  configFile.value = await getRuntimeConfigFileAPI()
}
export const fetchConfigFileWithName = async (name: string) => {
  configFile.value = await getConfigFileAPI(name)
}
export const deleteConfigFileWithName = async (name: string) => {
  await deleteConfigFileAPI(name)
  await fetchConfigFileList()
}
