import axios from '@/axios.js'

/**
 * axios.post()函数里面有三个基本的参数，
 * 第一个指定的是路径url（快递地址），
 * 第二个指定的是数据data（快递本身），
 * 第三个是接收方式config
 * */

/**
 * 获取测试题目
 * @param {string} version - 测试版本
 * @returns {Promise}
 */
export function getTestQuestions(version) {
    return axios.post('/test/questions', {
        // 这里的侧式版本参数需要
        // eg：后端API期望接收JSON对象：{ "version": "简洁版" }
        version: version
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 提交测试答案
 * @param {Object} submitData - 提交的数据
 * @returns {Promise}
 */
export function submitTestAnswers(submitData) {
    // submitData 已经构造好的完整数据对象，不需要拆分参数了，直接提交给后端
    return axios.post('/test/submit', submitData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 获取测试结果
 * @param {string} testId - 测试ID
 * @returns {Promise}
 */
export function getTestResult(testId) {
    return axios.get(`/test/result/${testId}`)
}