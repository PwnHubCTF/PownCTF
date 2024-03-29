<template>
  <div class="p-8">
    <!-- Available challenges -->
    <div class="overflow-x-auto relative">
      <TablePaginate
        ref="data"
        :headers="headers"
        :getRoute="$api.challenges.getAll"
      >
        <template v-slot:name="{ item }">
          <span class="flex items-center">
            <span class="whitespace-nowrap">{{ item.name }}</span>
            <svg
              v-if="item.instance"
              v-tooltip="'Using instance deployer'"
              class="ml-2 w-6 h-6 text-gray-500"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path
                d="M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"
              />
            </svg>
            <svg
              v-if="item.xss"
              v-tooltip="'Using XSS Bot'"
              class="ml-2 w-6 h-6 text-gray-500"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path
                d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"
              />
            </svg>
          </span>
        </template>
        <template v-slot:category="{ item }">{{ item.category }}</template>
        <template v-slot:source="{ item }">
          <a
            :href="item.githubUrl"
            v-if="item.source == 'github'"
            v-tooltip="'Go to github project folder'"
            target="_blank"
            rel="noopener noreferrer"
            >{{ item.source }}</a
          ><span v-else>{{ item.source }}</span>
        </template>
        <template v-slot:challengeUrl="{ item }">
          <span v-if="item.instance == 'single'">
            <ButtonDeployer :challenge="item" :admin="true" />
          </span>
          <span v-else>{{ item.challengeUrl }}</span>
          <span
            v-tooltip="
              'This is an instance challenge. Player need to deploy their instance'
            "
            v-if="item.instance == 'multiple'"
            >Player</span
          >
        </template>
        <template v-slot:files="{ item }">
          <ul>
            <li v-for="file of item.files" :key="file.id">
              <a target="_blank" :href="`/api/files/${file.id}`">{{
                file.name
              }}</a>
            </li>
          </ul>
        </template>
        <template v-slot:depends_on="{ item }">
          <ul>
            <li v-for="depended of item.depends_on" :key="depended.id">
              {{ depended.name }}
            </li>
          </ul>
        </template>
        <template v-slot:flag="{ item }">
          <div class="flex items-center">
            <p
            class="cursor-pointer"
            @click="copy(item.flag)"
            v-tooltip="item.flag"
          >
            Copy
          </p>
          <span class="ml-1" v-if="item.signedFlag" v-tooltip="'This flag is signed'"
            ><svg
            class="text-gray-500"
              fill="currentColor"
              width="8"
              height="8"
              viewBox="0 0 512 512"
            >
              <path
                d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
              />
            </svg>
          </span>
          </div>
        </template>
        <template v-slot:pointMultiplicator="{ item }"
          >{{ item.pointMultiplicator * 100 }}%</template
        >
        <template v-slot:action="{ item }">
          <div class="flex items-center gap-2">
            <Button
              :loading="loading"
              v-tooltip="'Delete this challenge (no confirm)'"
              @clicked="deleteChallenge(item)"
              class="w-16"
            >
              <svg
                fill="currentColor"
                width="16"
                height="16"
                class="text-white mx-auto"
                viewBox="0 0 448 512"
              >
                <path
                  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                />
              </svg>
            </Button>

            <Button
              v-if="!item.hidden"
              :loading="loading"
              v-tooltip="'Hide challenge'"
              @clicked="setHideChallenge(item, true)"
              class="w-16 bg-green-500"
            >
              <svg
                fill="currentColor"
                width="16"
                height="16"
                class="text-white mx-auto"
                viewBox="0 0 576 512"
              >
                <path
                  d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
                />
              </svg>
            </Button>

            <Button
              v-else
              :loading="loading"
              @clicked="setHideChallenge(item, false)"
              class="w-16 bg-red-500"
              v-tooltip="'Show challenge'"
            >
              <svg
                fill="currentColor"
                width="16"
                height="16"
                class="text-white mx-auto"
                viewBox="0 0 640 512"
              >
                <path
                  d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
                />
              </svg>
            </Button>
          </div>
        </template>
      </TablePaginate>
    </div>
    <!-- Params -->
    <div class="flex mt-8">
      <div class="w-1/2 p-6 border rounded-sm">
        <!-- Github Challenges loader -->
        <AdminChallengesLoader @refresh="$refs.data.refresh()" />
      </div>
      <div class="w-1/2 p-6">
        <!-- Update points -->
        <Button
          :loading="loading"
          @clicked="updateChallengesPoints"
          class="bg-orange-400 text-white"
          v-tooltip="
            'Update points for users/challenges. Usefull if config has been modified'
          "
          >Update challenges points</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      loading: false,
      headers: [
        { name: "Name", value: "name" },
        { name: "Category", value: "category" },
        { name: "Source", value: "source" },
        { name: "Access", value: "challengeUrl" },
        { name: "Files", value: "files" },
        { name: "Dependencies", value: "depends_on" },
        { name: "Flag", value: "flag" },
        { name: "Multiplicator", value: "pointMultiplicator" },
        { name: "Tags", value: "tags" },
        { name: "Action", value: "action" },
      ],
    };
  },
  methods: {
    async deleteChallenge(challenge) {
      this.loading = true;
      await this.$api.challenges.delete(challenge.id);
      await this.$refs.data.refresh();
      this.loading = false;
    },
    async setHideChallenge(challenge, hidden) {
      this.loading = true;
      await this.$api.challenges.editChallenge(challenge.id, {
        hidden,
      });
      await this.$refs.data.refresh();
      this.loading = false;
      this.$toast.success("Challenge updated");
    },
    async copy(txt) {
      await navigator.clipboard.writeText(txt);
      this.$toast.success("Copied!");
    },
    async updateChallengesPoints() {
      this.loading = true;
      await this.$api.challenges.updateChallengesPoints();
      await this.$refs.data.refresh();
      this.$toast.success("Points updated");
      this.loading = false;
    },
  },
};
</script>
