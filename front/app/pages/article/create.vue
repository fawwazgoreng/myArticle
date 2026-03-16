<script setup>
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";

const categoryStore = useCategoryStore();
const { category } = storeToRefs(categoryStore);

const config = useRuntimeConfig();
const preview = ref(null);
const isDragging = ref(false);
const isSubmitting = ref(false);
const flash = reactive({ show: false, type: "", message: "" });

const payload = reactive({
    image: "",
    title: "",
    content: "",
    category: [],
});

const showFlash = (type, message) => {
    flash.type = type;
    flash.message = message;
    flash.show = true;
    setTimeout(() => (flash.show = false), 3500);
};

const deleteCategory = (value) => {
    payload.category = payload.category.filter((name) => name !== value);
};

const handleCategory = (value) => {
    payload.category.includes(value)
        ? deleteCategory(value)
        : payload.category.push(value);
};

const inputImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (preview.value) URL.revokeObjectURL(preview.value);
    preview.value = URL.createObjectURL(file);
    payload.image = file;
};

watch(payload, () => {
    console.log(payload);
});

const handleDrop = (e) => {
    isDragging.value = false;
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (preview.value) URL.revokeObjectURL(preview.value);
    preview.value = URL.createObjectURL(file);
    payload.image = file;
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, content, category } = payload;
    if (title.length < 3)
        return showFlash("error", "Title minimal 3 charackter.");
    if (content.length < 3)
        return showFlash("error", "Content minimal 3 charackter.");
    if (category.length < 1)
        return showFlash("error", "Select minimal 1 category.");
    const form = new FormData();
    form.append("image", toRaw(payload.image));
    form.append("title", title);
    form.append("content", content);
    form.append("category", category);
    isSubmitting.value = true;
    try {
        const data = await $fetch(`${config.public.apiBaseUrl}/article`, {
            method: "POST",
            body: form
        });
        showFlash("success", "article published!");
        if (data.status == 201) {
            payload.title = "";
            payload.content = "";
            payload.category = [];
            if (preview) {
                URL.revokeObjectURL(preview);
                preview.value = null; 
            }
        }
    } catch (error) {
        const errorData = error.response._data;
        showFlash("error", errorData.message || "failed publish article. Try again.");
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen px-6 py-12 max-w-6xl mx-auto">
        <!-- Flash Message -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-3 scale-95"
            leave-active-class="transition duration-200 ease-in"
            leave-to-class="opacity-0 -translate-y-3 scale-95"
        >
            <div
                v-if="flash.show"
                :class="[
                    'fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium border',
                    flash.type === 'success'
                        ? 'border-green-200 text-green-700'
                        : 'border-red-200 text-red-600',
                ]"
            >
                <span
                    :class="[
                        'w-5 h-5 rounded-full grid place-items-center text-xs font-bold shrink-0 text-white',
                        flash.type === 'success'
                            ? 'bg-green-500'
                            : 'bg-red-500',
                    ]"
                >
                    {{ flash.type === "success" ? "✓" : "✕" }}
                </span>
                {{ flash.message }}
            </div>
        </Transition>

        <!-- Header -->
        <div class="mb-10">
            <h1 class="text-3xl font-semibold text-gray-800">Create Article</h1>
            <p class="text-sm text-gray-400 mt-1">
                Fill in the details below to publish your article.
            </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="grid grid-cols-5 gap-8">
            <!-- Left Column -->
            <div class="col-span-2 flex flex-col gap-6">
                <!-- Image Drop -->
                <div
                    @dragover.prevent="isDragging = true"
                    @dragleave="isDragging = false"
                    @drop.prevent="handleDrop"
                    :class="[
                        'relative h-72 rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-200',
                        isDragging
                            ? 'border-blue-400'
                            : 'border-dashed border-gray-200',
                    ]"
                >
                    <input
                        type="file"
                        accept="image/*"
                        @change="inputImage"
                        class="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <img
                        v-if="preview"
                        :src="preview"
                        alt="preview"
                        class="w-full h-full object-cover"
                    />
                    <div
                        v-else
                        class="w-full h-full flex flex-col items-center justify-center gap-2 pointer-events-none"
                    >
                        <span class="text-2xl text-gray-300">⬆</span>
                        <p class="text-sm text-gray-400 font-medium">
                            Drop image here
                        </p>
                        <p class="text-xs text-gray-300">or click to browse</p>
                    </div>
                </div>

                <!-- Category -->
                <div class="flex flex-col gap-4">
                    <p
                        class="text-xs tracking-widest uppercase text-gray-400 font-medium"
                    >
                        Categories
                    </p>

                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="cat in category"
                            :key="cat.name"
                            type="button"
                            @click="handleCategory(cat.name)"
                            :class="[
                                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                                payload.category.includes(cat.name)
                                    ? 'bg-blue-500 border-blue-500 text-white'
                                    : 'border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500',
                            ]"
                        >
                            {{ cat.name }}
                        </button>
                    </div>

                    <div class="pt-4 border-t border-gray-100">
                        <div
                            v-if="payload.category.length"
                            class="flex flex-wrap gap-2"
                        >
                            <span
                                v-for="name in payload.category"
                                :key="name"
                                @click="deleteCategory(name)"
                                class="inline-flex items-center gap-1.5 px-3 py-1 border border-blue-200 rounded-full text-xs text-blue-500 cursor-pointer hover:border-red-300 hover:text-red-400 transition-colors"
                            >
                                {{ name }}
                                <span class="opacity-60 text-sm leading-none"
                                    >×</span
                                >
                            </span>
                        </div>
                        <p v-else class="text-xs text-gray-300">
                            Belum ada kategori dipilih
                        </p>
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="col-span-3 flex flex-col gap-5 sticky top-8 self-start">
                <!-- Title -->
                <div class="flex flex-col gap-2">
                    <label
                        for="title"
                        class="text-xs tracking-widest uppercase text-gray-400 font-medium"
                        >Title</label
                    >
                    <input
                        id="title"
                        type="text"
                        spellcheck="false"
                        placeholder="Write title article..."
                        @input="(e) => (payload.title = e.target.value)"
                        class="w-full border border-gray-200 rounded-xl text-gray-800 text-xl px-4 py-3 outline-none focus:border-blue-400 transition-colors placeholder:text-gray-300"
                    />
                </div>

                <!-- Content -->
                <div class="flex flex-col gap-2">
                    <label
                        for="content"
                        class="text-xs tracking-widest uppercase text-gray-400 font-medium"
                        >Content</label
                    >
                    <textarea
                        id="content"
                        spellcheck="false"
                        placeholder="Write content article..."
                        @input="(e) => (payload.content = e.target.value)"
                        class="w-full border border-gray-200 rounded-xl text-gray-800 text-base leading-relaxed px-4 py-3 outline-none focus:border-blue-400 transition-colors placeholder:text-gray-300 resize-none min-h-64"
                    />
                </div>

                <!-- Submit -->
                <button
                    type="submit"
                    :disabled="isSubmitting"
                    :class="[
                        'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white bg-blue-500 transition-all duration-200 text-sm',
                        isSubmitting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-blue-600 active:scale-95',
                    ]"
                >
                    <svg
                        v-if="isSubmitting"
                        class="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                        />
                    </svg>
                    {{ isSubmitting ? "Publishing..." : "Publish Article →" }}
                </button>
            </div>
        </form>
    </div>
</template>
