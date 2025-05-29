<template>
  <div class="flex h-full flex-col gap-1 overflow-x-hidden p-2">
    <div class="card">
      <div class="card-title justify-between px-4 pt-4">
        {{ $t('config') }}
      </div>
      <div class="card-body">
        <div class="flex gap-2">
          <input
            v-model="configURL"
            class="input input-sm flex-1"
            :placeholder="$t('pantheon.subscriptionURL')"
          />
          <button
            class="btn btn-sm"
            @click="handleAddRemoteConfig"
          >
            {{ $t('pantheon.downloadConfig') }}
          </button>
          <button
            class="btn btn-sm"
            @click="handleAddLocalConfig"
          >
            {{ $t('pantheon.importConfig') }}
          </button>
          <input
            ref="configFileInput"
            type="file"
            class="hidden"
            @change="handleAddLocalConfigUploaded"
          />
        </div>
        <div
          class="grid gap-2 overflow-x-hidden overflow-y-auto"
          :style="`grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));`"
        >
          <div
            v-for="config in configFileList"
            :key="config.name"
            class="card h-18 cursor-pointer shadow-none"
            :class="
              config.isActive
                ? 'bg-primary text-primary-content'
                : 'bg-base-200 text-base-content hover:bg-base-300'
            "
            @click="handleSelectConfig(config.name)"
          >
            <div class="flex flex-1 items-center px-2">
              {{ config.name }}
            </div>
            <div class="flex w-full items-center justify-end px-2">
              <button
                v-if="config.type === 'remote'"
                class="btn btn-circle btn-ghost btn-sm"
                @click="handleUpdateConfig(config.name)"
              >
                <ArrowPathIcon class="h-4 w-4" />
              </button>
              <button
                class="btn btn-circle btn-ghost btn-sm"
                @click="handleDeleteConfig(config.name)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfigEditor />
  </div>
</template>

<script setup lang="ts">
import { deleteConfigAPI, setActiveConfigAPI, updateConfigAPI } from '@/renderer/src/api/ipc-invoke'
import {
  configFileList,
  fetchConfigFileList,
  fetchConfigFileWithName,
  fetchIsCoreRunning,
  setConfig,
} from '@/renderer/src/store/ipc-store'
import { ArrowPathIcon, TrashIcon } from '@heroicons/vue/24/outline'
import ConfigEditor from '@renderer/components/config/ConfigEditor.vue'
import { onMounted, ref } from 'vue'

const configFileInput = ref()
const configURL = ref('')

const handleAddRemoteConfig = async () => {
  await setConfig({
    url: configURL.value,
    name: new URL(configURL.value).hostname,
    type: 'remote',
    isActive: false,
  })
  fetchConfigFileList()
}

const handleUpdateConfig = async (name: string) => {
  await updateConfigAPI(name)
  fetchConfigFileList()
}

const handleAddLocalConfig = async () => {
  configFileInput.value.click()
}

const handleAddLocalConfigUploaded = async () => {
  const file = configFileInput.value.files[0]
  if (!file) return
  const fileContentString = await file.text()

  await setConfig(
    {
      name: file.name,
      type: 'local',
      isActive: false,
    },
    fileContentString,
  )
  fetchConfigFileList()
}

const handleDeleteConfig = async (name: string) => {
  await deleteConfigAPI(name)
  fetchConfigFileList()
}

const handleSelectConfig = async (name: string) => {
  await setActiveConfigAPI(name)
  fetchConfigFileWithName(name)
  fetchConfigFileList()
}

onMounted(async () => {
  fetchIsCoreRunning()
  fetchConfigFileList()
})
</script>
