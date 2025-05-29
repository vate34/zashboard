<template>
  <div class="card relative flex flex-1 flex-col gap-1 overflow-x-hidden">
    <div class="card-title p-4">
      {{ activeConfigName }}
    </div>
    <VueMonacoEditor
      v-model:value="configFile"
      :theme="isDarkTheme ? 'vs-dark' : 'vs'"
      language="json"
    />
    <button
      class="btn btn-sm absolute right-2 bottom-2 z-50"
      @click="handleConfigSave"
    >
      {{ $t('pantheon.save') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { activeConfigName, configFile } from '@/renderer/src/store/ipc-store'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import { isDarkTheme } from '@renderer/helper/utils'
import { setConfigFileAPI } from '../../api/ipc-invoke'

const handleConfigSave = () => {
  configFile.value = configFile.value.trim()

  setConfigFileAPI(activeConfigName.value, configFile.value)
}
</script>
