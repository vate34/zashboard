<template>
  <div class="card gap-2 p-2 text-sm">
    <div class="flex items-center gap-2">
      <template v-if="isCoreRunning">
        {{ $t('pantheon.coreIsRunning') }}
        <span class="relative flex size-3">
          <span
            class="bg-primary/75 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          />
          <span class="bg-primary/75 relative inline-flex size-3 rounded-full" />
        </span>
      </template>
      <template v-else>
        {{ $t('pantheon.coreIsNotRunning') }}
        <span class="relative flex size-3">
          <span
            class="bg-neutral/75 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          />
          <span class="bg-neutral/75 relative inline-flex size-3 rounded-full" />
        </span>
      </template>
    </div>
    <div>
      <button
        class="btn btn-sm"
        @click="toggleServiceMode"
      >
        {{
          isServiceModeInstalled ? $t('pantheon.uninstallService') : $t('pantheon.installService')
        }}
      </button>
    </div>
    <div>
      <button
        class="btn btn-sm"
        @click="toggleCoreRunning"
      >
        {{ !isCoreRunning ? $t('pantheon.startCore') : $t('pantheon.stopCore') }}
      </button>
    </div>
    <div>
      {{ $t('pantheon.autoLaunch') }}
      <input
        v-model="isAutoLaunchEnabled"
        type="checkbox"
        class="toggle"
        @change="toggleAutoLaunch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  disableAutoLaunchAPI,
  enableAutoLaunchAPI,
  installServiceModeAPI,
  removeServiceModeAPI,
  startCoreAPI,
  stopCoreAPI,
} from '../../api/ipc-invoke'
import {
  fetchIsAutoLaunchEnabled,
  fetchIsCoreRunning,
  fetchIsServiceModeInstalled,
  isAutoLaunchEnabled,
  isCoreRunning,
  isServiceModeInstalled,
} from '../../store/ipc-store'

const toggleAutoLaunch = async () => {
  if (isAutoLaunchEnabled.value) {
    await enableAutoLaunchAPI()
  } else {
    await disableAutoLaunchAPI()
  }
  fetchIsAutoLaunchEnabled()
}

const toggleCoreRunning = async () => {
  if (!isCoreRunning.value) {
    const str = await startCoreAPI()

    console.log(str)
  } else {
    await stopCoreAPI()
  }
  fetchIsCoreRunning()
}

const toggleServiceMode = async () => {
  if (isServiceModeInstalled.value) {
    await removeServiceModeAPI()
  } else {
    await installServiceModeAPI()
  }
  fetchIsServiceModeInstalled()
}
</script>
