<template>
  <div class="word-warper">
    <el-button @click="showDoc">读取模版</el-button>
    <el-row>
      <el-col :span="18">
        <div v-html="html"></div>
        <el-button v-if="renderHtml" @click="saveFile"
          >下载[{{ fileName || '文件名称' }}.docx]</el-button
        >
      </el-col>
      <el-col :span="6">
        <el-form
          v-if="arr.length"
          ref="ruleFormRef"
          :model="form"
          label-width="120px"
        >
          <el-form-item v-for="i in arr" :key="i" :label="i" :prop="i" required>
            <el-input v-model="form[i]" />
          </el-form-item>
          <el-form-item label="文件名称">
            <el-input v-model="fileName" />
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm(ruleFormRef)">生成文件</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'

import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'
import mammoth from 'mammoth'

const html = ref('')
const renderHtml = ref()
const fileDoc = ref()

const arr = ref<Array<string>>([])

const ruleFormRef = ref<FormInstance>()
const form = ref<any>({})
const fileName = ref('文件名称')
/**
 * 读取文件
 * @param url 文件地址
 */
const getFile = (url: string): Promise<Docxtemplater<any>> =>
  new Promise((resolve, reject) => {
    PizZipUtils.getBinaryContent(url, (error, content) => {
      if (error) {
        console.log('文件加载失败')
        reject(error)
        throw error
      }
      const doc = new Docxtemplater(new PizZip(content), {
        paragraphLoop: true,
        linebreaks: true,
      })
      resolve(doc)
    })
  })

/**
 * 查看文件
 */
const showDoc = () => {
  getFile('./data/demo.docx').then((doc) => {
    fileDoc.value = doc
    renderHtml.value = ''
    const arrayBuffer = doc.getZip().generate({
      type: 'arraybuffer',
    })
    convertToHtml(arrayBuffer)
  })
}

/**
 * 渲染html
 * @param arrayBuffer 文本数据
 */
const convertToHtml = (arrayBuffer: ArrayBuffer) => {
  mammoth
    .convertToHtml({ arrayBuffer })
    .then((result) => {
      html.value = result.value // The generated HTML
      arr.value = setInput(html.value.match(/{[A-Za-z]+\d?}/g) || [])
      arr.value.forEach((i: string) => (form.value[i] = ''))
    })
    .catch(() => {
      console.error('渲染失败')
    })
}

const setInput = (arr: Array<string>) => {
  return arr.map((key: string) => key.replace(/{(.*)}/, '$1'))
}

/**
 * 填充变量并渲染html
 */
const renderDoc = () => {
  fileDoc.value
    .renderAsync(form.value)
    .then(() => {
      renderHtml.value = fileDoc.value
      const arrayBuffer = fileDoc.value.getZip().generate({
        type: 'arraybuffer',
      })
      convertToHtml(arrayBuffer)
    })
    .catch(() => {
      console.log('文件处理失败')
    })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      renderDoc()
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**
 * 下载文件
 */
const saveFile = () => {
  const out = renderHtml.value.getZip().generate({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
  // Output the document using Data-URI
  saveAs(out, `${fileName.value || '文件名称'}.docx`)
}
</script>
<style lang="stylus" scoped>
.word-warper {
  margin 20px
}
</style>
