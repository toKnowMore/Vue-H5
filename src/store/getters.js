const getters = {
  language: state => state.app.language,
  token: state => state.user.token,
  username: state => state.user.username,
  platformId: state => state.user.platformId,
  memberId: state => state.user.memberId,
  carrierId: state => state.user.carrierId,
  categoryId: state => state.user.categoryId,
  contentId: state => state.user.contentId,
  jobId: state => state.user.jobId,
  jobName: state => state.user.jobName,
  reallyName: state => state.user.reallyName,
  avatar: state => state.user.avatar,
  balance: state => state.user.balance,
  exranceCode: state => state.user.exranceCode
}
export default getters

