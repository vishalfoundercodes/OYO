const mongoose=require('mongoose');
const onboardPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    pageId: { type: Number, required: true },
  }
);
const onBoradPage=mongoose.model('OnboardPage',onboardPageSchema);
module.exports=onBoradPage;
