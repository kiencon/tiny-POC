import $axios from 'axios';

export const getBaseTemplateDataApi = (templateId = 19523) => $axios
  .get(`https://proapi.survivalapp.com/activity/821752`);

