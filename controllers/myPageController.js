const db = require("../models/index"),
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;
const axios = require('axios');

module.exports = {
    //마이페이지 메인(게시글 보기)
    mypageMain: async (req, res) => {
        try {
            const userId = req.session.user.userId;
            const response = await axios.get(`http://community:3000/community-api/posts/${userId}`, {
                headers: {
                  Cookie: req.headers.cookie
                },
                timeout: 5000 // 5초 안에 응답 없으면 오류 발생
            });
            
              console.log("응답 도착:", response.status, response.data);
              let myposts = response.data;

            let postsMap = {};
            myposts.forEach(post => {
                if (!postsMap[post.postId]) {
                    postsMap[post.postId] = {
                        title: post.title,
                        postId: post.postId,
                        userId: post.userId,
                        images: []
                    };
                }
                postsMap[post.postId].images.push(post.imageUrl);
            });

            let postsArray = Object.values(postsMap);

            let query2 = `
                SELECT nickname
                FROM users
                WHERE userId = ${userId};     
            `;
            let [results] = await sequelize.query(query2, { type: Sequelize.SELECT });
            
            // 프로필 이미지는 이미지 서비스에서 가져오기
            let profileImageUrl = null;
            try {
                console.log("이미지 요청 보내는 중:", userId);
                const imgRes = await axios.get(`http://image-service:3000/image/user/${userId}`);
                console.log("✅ 이미지 응답:", imgRes.status);
                profileImageUrl = imgRes.data.url || imgRes.data.imageUrl; // 응답 구조에 따라
                console.log("✅ 이미지 url:", profileImageUrl);

            } catch (err) {
                console.warn("❌ 이미지 요청 실패:", err.message);
                if (err.response) {
                    console.warn("서버 응답 상태:", err.response.status);
                    console.warn("응답 본문:", err.response.data);
                } else if (err.request) {
                    console.warn("요청은 전송됐지만 응답 없음:", err.request);
                } else {
                    console.warn("요청 자체 실패:", err.message);
                }
            }

            const profileResult = {
                ...results[0],
                imageUrl: profileImageUrl
            };
            res.render("auth/mypage_main", {
                posts: postsArray,
                result: profileResult,
                userId: userId
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
    },

    //마이페이지(스크랩 보기)
    mypageScrap: async (req, res) => {
        try {
            const userId = req.session.user.userId;
            //내가 저장한 게시글 목록 불러오기 
            const response = await axios.get(`http://community:3000/community-api/saves/${userId}`, {
                headers: {              
                  Cookie: req.headers.cookie
                },
                timeout: 5000 // 5초 안에 응답 없으면 오류 발생
              });
            
              console.log("응답 도착:", response.status, response.data);
              let myposts = response.data;

             // 날짜 출력 조정 
             myposts.forEach(post => {
                const date = new Date(post.date);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                post.date = date.toLocaleDateString('en-US', options);
            });

            //팝업에 닉네임이랑 프로필 뜨게 
            let query2 = `SELECT nickname FROM users WHERE userId = ${userId};`;
            let [results] = await sequelize.query(query2, { type: Sequelize.SELECT });

            let profileImageUrl = null;
            try {
                const imgRes = await axios.get(`http://image-service:3000/image/user/${userId}`);
                profileImageUrl = imgRes.data.url || imgRes.data.imageUrl;
            } catch (err) {
                console.warn("❌ 이미지 요청 실패:", err.message);
            }

            const profileResult = {
                ...results[0],
                imageUrl: profileImageUrl
            };

            res.render("auth/mypage_scrap", { posts: myposts, result: profileResult, userId: userId });
       } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
        
        
    },

    //마이페이지(댓글 보기)
    mypageComment: async (req, res) => {
        try {
            //내가 단 댓글 목록 불러오기 
            const userId = req.session.user.userId;
            const response = await axios.get(`http://community:3000/community-api/comments/${userId}`, {
                headers: {
                  Cookie: req.headers.cookie
                },
                timeout: 5000 // 5초 안에 응답 없으면 오류 발생
              });
            
              console.log("응답 도착:", response.status, response.data);
              let myposts = response.data;
             // 날짜 출력 조정
             myposts.forEach(post => {
                const date = new Date(post.createdAt);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                post.createdAt = date.toLocaleDateString('en-US', options);
            });

            //팝업에 닉네임이랑 프로필 뜨게 
            let query2 = `SELECT nickname FROM users WHERE userId = ${userId};`;
            let [results] = await sequelize.query(query2, { type: Sequelize.SELECT });

            let profileImageUrl = null;
            try {
                const imgRes = await axios.get(`http://image-service:3000/image/user/${userId}`);
                profileImageUrl = imgRes.data.url || imgRes.data.imageUrl;
            } catch (err) {
                console.warn("❌ 이미지 요청 실패:", err.message);
            }

            const profileResult = {
                ...results[0],
                imageUrl: profileImageUrl
            };

            res.render("auth/mypage_comment", { posts: myposts, result: profileResult, userId: userId });
         } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
    },

    // 마이페이지(개최한 펀딩 보기)
mypageMyFunding: async (req, res) => {
    try {
        const userId = req.session.user.userId;

        const response = await axios.get("http://funding-service:3001/funding/opened", {
            headers: {
              Cookie: req.headers.cookie
            },
            timeout: 5000 // 5초 안에 응답 없으면 오류 발생
          });
        
          console.log("응답 도착:", response.status, response.data);
          let myposts = response .data;
        

        // 날짜 출력 조정 
        myposts.forEach(post => {
            const date = new Date(post.fundingDate);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            post.fundingDate = date.toLocaleDateString('en-US', options);
        });

        // 팝업에 닉네임이랑 프로필 뜨게 
        let query2 = `SELECT nickname FROM users WHERE userId = ${userId};`;
            let [results] = await sequelize.query(query2, { type: Sequelize.SELECT });

            let profileImageUrl = null;
            try {
                const imgRes = await axios.get(`http://image-service:3000/image/user/${userId}`);
                profileImageUrl = imgRes.data.url || imgRes.data.imageUrl;
            } catch (err) {
                console.warn("❌ 이미지 요청 실패:", err.message);
            }

            const profileResult = {
                ...results[0],
                imageUrl: profileImageUrl
            };

            res.render("auth/mypage_myfunding", { posts: myposts, result: profileResult, userId: userId });
        
    } catch (axiosError) {
        console.error("Axios 에러:", axiosError.code, axiosError.message);
        if (axiosError.response) {
          console.error("응답 상태:", axiosError.response.status);
          console.error("응답 내용:", axiosError.response.data);
        }
      }
    // } catch (error) {
    //     res.status(500).send({ message: error.message });
    //     console.error(`Error: ${error.message}`);
    // }
},

    //마이페이지(참여한 펀딩보기)
    mypageParticipatedFunding: async (req, res) => {
        try {
            //참여한 펀딩 불러오기 
            const userId = req.session.user.userId;
            
            // 공동구매 서비스에 요청
            const response = await axios.get("http://funding-service:3001/funding/participated", {
                headers: {
                    Cookie: req.headers.cookie
                }
            });


            let myposts = response.data;

                // 날짜 출력 조정
            myposts.forEach(post => {
                const date = new Date(post.fundingGroup.fundingDate);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                post.fundingGroup.fundingDate = date.toLocaleDateString('en-US', options);
            });

            //팝업에 닉네임이랑 프로필 뜨게 
            let query2 = `SELECT nickname FROM users WHERE userId = ${userId};`;
            let [results] = await sequelize.query(query2, { type: Sequelize.SELECT });

            let profileImageUrl = null;
            try {
                const imgRes = await axios.get(`http://image-service:3000/image/user/${userId}`);
                profileImageUrl = imgRes.data.url || imgRes.data.imageUrl;
            } catch (err) {
                console.warn("❌ 이미지 요청 실패:", err.message);
            }

            const profileResult = {
                ...results[0],
                imageUrl: profileImageUrl
            };

            res.render("auth/mypage_participatedfunding", { posts: myposts, result: profileResult, userId: userId });
       } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
    },
};
